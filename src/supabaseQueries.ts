import { supaClient } from './supaClient';
import {
    BusinessDayDriver,
    Drawer,
    Profile,
    Driver_Drawer,
    Order, // only used to interact directly with supabase db
    NewOrder,
    OrderOrigin,
    Order_Payment,
    Driver,
    PaymentType,
    Resource,
} from './typesAndValidators';
import { z } from 'zod';
import dayjs from 'dayjs';
import { dayjsToMDY } from './utils';
import { PostgrestError } from '@supabase/supabase-js';
import { REQUIRED_RESOURCES, mergeResourcesWithDefaults } from './constants/resources';

type DirtyDriverDrawer = { drawer: Drawer; driver: Profile };

const supabaseDate = z.object({
    year: z.number().min(2024).max(2100),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
});

const validateBusinessDate = (businessDate: dayjs.Dayjs) => {
    const { month, day, year } = dayjsToMDY(businessDate);
    try {
        supabaseDate.parse({ year, month, day });
        return { month, day, year };
    } catch (error) {
        return { month, day, year, error };
    }
};

export const handleResponse = <T>({
    data,
    error,
    shouldThrow,
}: {
    data: unknown[] | null;
    error: PostgrestError | null;
    shouldThrow?: boolean;
}) => {
    if (error) {
        if (shouldThrow) {
            throw error;
        }
        return [] as T[];
    }
    if (!data) {
        return [] as T[];
    }
    if (!Array.isArray(data)) {
        return [data as T];
    }
    return data as T[];
};

export const getAllDrawers = async () => {
    const { data, error } = await supaClient.from('Drawer').select('*').neq('drawer_type', 'driver');

    if (error) {
        return [] as Drawer[];
    }

    // Type assertion needed: Supabase returns generic type that doesn't match our specific Drawer type
    return data as unknown as Drawer[];
};

const convertToDriverDrawer = (dirtyDriverDrawer: DirtyDriverDrawer): Driver_Drawer => {
    return {
        ...dirtyDriverDrawer.drawer,
        driver: dirtyDriverDrawer.driver,
    };
};

export const getAllDrivers = async () => {
    const { data, error} = await supaClient
        .from('Driver')
        .select('drawer:Drawer(*), driver:Profile(*)')
        .eq('is_deleted', false);

    if (error) {
        return [] as Driver_Drawer[];
    }

    // can probably remove this conversion if I change the select
    return data.map((d) => convertToDriverDrawer(d as unknown as DirtyDriverDrawer));
};

export const getAllOrigins = async () => {
    const { data, error } = await supaClient.from('OrderOrigin').select('*').order('name', { ascending: true });
    if (error) {
        return [] as OrderOrigin[];
    }

    return data as unknown as OrderOrigin[];
};

export const getAllResources = async () => {
    const { data, error } = await supaClient.from('Resource').select('*');
    if (error) {
        return mergeResourcesWithDefaults([]);
    }

    const existing = (data ?? []) as Resource[];
    const existingTitles = new Set(existing.map((resource) => resource.title));
    const missing = REQUIRED_RESOURCES.filter((resource) => !existingTitles.has(resource.title)).map(
        ({ title, src }) => ({ title, src }),
    );

    if (missing.length > 0) {
        const { data: inserted } = await supaClient.from('Resource').insert(missing).select('*');
        if (inserted) {
            return mergeResourcesWithDefaults([...(existing), ...(inserted as Resource[])]);
        }
    }

    return mergeResourcesWithDefaults(existing);
};

export const getAllAppSettings = async () => {
    const { data, error } = await supaClient.from('AppSetting').select('*');
    type AppSettingDefaults = {
        delivery_fee_in_cents: number;
        driver_starting_cash_in_cents: number;
        driver_hourly_wage_in_cents: number;
        register_starting_cash_in_cents: number;
        register_for_bank_transfers: string;
        register_for_cash_transfers: string;
    };

    const constants: { default: AppSettingDefaults } = {
        default: {
            delivery_fee_in_cents: 0,
            driver_starting_cash_in_cents: 0,
            driver_hourly_wage_in_cents: 0,
            register_starting_cash_in_cents: 0,
            register_for_bank_transfers: '',
            register_for_cash_transfers: '',
        },
    };

    function isAssignableToDefault<T extends keyof AppSettingDefaults>(
        key: T,
        value: number | string,
    ): value is AppSettingDefaults[T] {
        const defaultValue = constants.default[key];
        return typeof defaultValue === typeof value;
    }

    if (error) {
        return constants;
    }

    data.forEach(({ setting_name, setting_value, setting_type }) => {
        if (setting_name in constants.default) {
            // Narrow `setting_name` to valid keys of `constants.default`.
            const key = setting_name as keyof AppSettingDefaults;

            // Determine the value based on its type.
            const value = setting_type === 'integer' ? parseInt(setting_value, 10) : String(setting_value);

            if (isAssignableToDefault(key, value)) {
                (constants.default as Record<keyof AppSettingDefaults, number | string>)[key] = value;
            }
        }
    });

    return constants;
};

export const getAllDaysOrders = async (businessDate: dayjs.Dayjs) => {
    const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
    if (validateError) return [] as Order_Payment[];
    const { data, error } = await supaClient
        .from('Order')
        .select(
            `
        *,
        payments:Payment (
          *
        )
      `,
        )
        .eq('business_date', `${year}-${month}-${day}`)
        .order('order_number', { ascending: true });

    return handleResponse<Order_Payment>({ data, error });
};

export const getAllDaysDrivers = async (businessDate: dayjs.Dayjs) => {
    const formattedDate = businessDate.format('YYYY-MM-DD');
    const { data, error } = await supaClient.from('BusinessDayDriver').select('*').eq('business_date', formattedDate);

    return handleResponse<BusinessDayDriver>({ data, error });
};

export const addDriverToBusinessDay = async ({
    drawerID,
    businessDate,
}: {
    drawerID: string;
    businessDate: dayjs.Dayjs;
}) => {
    const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
    if (validateError) return [] as BusinessDayDriver[];
    const business_date = `${year}-${month}-${day}`;
    const { data, error } = await supaClient
        .from('BusinessDayDriver')
        .insert({
            business_date,
            drawer_id: drawerID,
        })
        .select();
    return handleResponse<BusinessDayDriver>({ data, error, shouldThrow: true });
};

export const removeDriverFromBusinessDay = async ({
    drawerID,
    businessDate,
}: {
    drawerID: string;
    businessDate: dayjs.Dayjs;
}) => {
    const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
    if (validateError) return [] as BusinessDayDriver[];
    const business_date = `${year}-${month}-${day}`;
    const { data, error } = await supaClient
        .from('BusinessDayDriver')
        .delete()
        .eq('business_date', business_date)
        .eq('drawer_id', drawerID)
        .select();
    return handleResponse<BusinessDayDriver>({ data, error, shouldThrow: true });
};

interface DummyQueryFnProps<T> {
    timeout?: number;
    data?: T[];
}

// return preset data with a set timeout
export const dummyQueryFn = async <T>({ timeout = 1000, data = [] }: DummyQueryFnProps<T> = {}): Promise<T[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, timeout);
    });
};

// run a function with a set timeout
export const queryFnWrapper = <T>(fn: () => Promise<T>, timeout: number): (() => Promise<T>) => {
    return async () => {
        const timeoutPromise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });

        const result = await Promise.all([fn(), timeoutPromise]);

        return result[0];
    };
};

export const createNewOrder = async ({ newOrder }: { newOrder: NewOrder & { initial_payment_type: PaymentType } }) => {
    const { data, error } = await supaClient.rpc('create_new_order_from_json', { p_order_json: newOrder });
    return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const updateOrder = async (orderWithPayments: Order_Payment) => {
    // remove .payments from order
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { payments, ...order } = orderWithPayments;
    const { data, error } = await supaClient.from('Order').update(order).eq('order_id', order.order_id).select();
    return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const addOrdersToDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('add_orders_to_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    if (error) {
        throw error;
    } else {
        return data;
    }
    // return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const removeOrdersFromDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('remove_orders_from_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    if (error) {
        throw error;
    } else {
        return data;
    }
    // can use handleResponse once we update the return type from db
    // return handleResponse<Order_Payment>({ data, error, shouldThrow: true });
};

export const getAllEmployees = async () => {
    const { data, error } = await supaClient.from('Profile').select('*');
    return handleResponse<Profile>({ data, error, shouldThrow: true });
};

interface UpdateEmployeeResponse {
    profile: Profile;
    driver: Driver;
}

export const updateEmployee = async (employee: Profile, is_driver: boolean) => {
    const { data, error } = await supaClient.rpc('handle_employee_update', {
        p_is_driver: is_driver,
        p_profile: employee,
    });
    return handleResponse<UpdateEmployeeResponse>({ data, error, shouldThrow: true });
};
