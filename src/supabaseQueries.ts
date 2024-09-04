import { supaClient } from './supaClient';
import {
    BusinessDayDriver,
    Drawer,
    Profile,
    Driver_Drawer,
    Order,
    NewOrder,
    OrderOrigin,
    Order_Payment,
    Driver,
} from './typesAndValidators';
import { z } from 'zod';
import dayjs from 'dayjs';
import { dayjsToMDY } from './utils';
import { PostgrestError } from '@supabase/supabase-js';
const bariPizzaLogo = new URL('/BP logo.png', import.meta.url).href;
const doorDashLogo = new URL('/DoorDash logo.png', import.meta.url).href;
const pizzamicoLogo = new URL('/Pizzamico logo.ico', import.meta.url).href;

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
        console.error(error);
        return { month, day, year, error };
    }
};

const handleResponse = <T>({
    data,
    error,
    shouldThrow,
}: {
    data: unknown[] | null;
    error: PostgrestError | null;
    shouldThrow?: boolean;
}) => {
    if (error) {
        console.error(error);
        if (shouldThrow) {
            throw error;
        }
        return [] as T[];
    }
    if (!data) {
        console.error('data is null');
        return [] as T[];
    }
    return data as T[];
};

export const getAllDrawers = async () => {
    const { data, error } = await supaClient.from('Drawer').select('*').neq('drawer_type', 'driver');

    if (error) {
        console.error(error);
        return [] as Drawer[];
    }

    return data as unknown as Drawer[];
};

const convertToDriverDrawer = (dirtyDriverDrawer: DirtyDriverDrawer): Driver_Drawer => {
    return {
        ...dirtyDriverDrawer.drawer,
        driver: dirtyDriverDrawer.driver,
    };
};

export const getAllDrivers = async () => {
    const { data, error } = await supaClient
        .from('Driver')
        .select('drawer:Drawer(*), driver:Profile(*)')
        .eq('is_deleted', false);

    if (error) {
        console.error(error);
        return [] as Driver_Drawer[];
    }

    // can probably remove this conversion if I change the select
    return data.map((d) => convertToDriverDrawer(d as unknown as DirtyDriverDrawer));
};

export const getAllOrigins = async () => {
    const { data, error } = await supaClient.from('OrderOrigin').select('*').order('name', { ascending: true });
    if (error) {
        console.error(error);
        return [] as OrderOrigin[];
    }
    // TODO: remove this hack once the logos are added to supabase
    const icons: Record<string, string> = {
        DoorDash: doorDashLogo,
        'Bari Pizza': bariPizzaLogo,
        Pizzamico: pizzamicoLogo,
    };

    data.forEach((origin: OrderOrigin) => {
        origin.icon = origin.icon || icons[origin.name] || '';
    });

    return data as unknown as OrderOrigin[];
};

export const getAllDaysOrders = async (businessDate: dayjs.Dayjs) => {
    const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
    if (validateError) return [] as Order_Payment[];
    const { data, error } = await supaClient
        .from('OrderPaymentsView')
        .select('*')
        .eq('business_date', `${year}-${month}-${day}`)
        .order('order_number', { ascending: true });

    return handleResponse<Order_Payment>({ data, error });
};

// export const getAllDaysPayments = async (businessDate: dayjs.Dayjs) => {
//     const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
//     if (validateError) return [] as Payment[];
//     const { data, error } = await supaClient.from('Payment').select('*').eq('business_date', `${year}-${month}-${day}`);

//     return handleResponse<Payment>({ data, error });
// };

export const getAllDaysDrivers = async (businessDate: dayjs.Dayjs) => {
    const { month, day, year, error: validateError } = validateBusinessDate(businessDate);
    if (validateError) return [] as BusinessDayDriver[];
    const { data, error } = await supaClient
        .from('BusinessDayDriver')
        .select('*')
        .eq('business_date', `${year}-${month}-${day}`);

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

export const createNewOrder = async (newOrder: NewOrder) => {
    console.log({ newOrder });
    const { data, error } = await supaClient.from('Order').insert([newOrder]).select();
    return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const updateOrder = async (order: Order) => {
    const { data, error } = await supaClient.from('Order').update(order).eq('order_id', order.order_id).select();
    return handleResponse<Order>({ data, error, shouldThrow: true });
};

export const addOrdersToDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('add_orders_to_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    if (error) {
        console.error(error);
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
    return handleResponse<Order>({ data, error, shouldThrow: true });
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
