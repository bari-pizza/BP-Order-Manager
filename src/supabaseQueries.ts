import { supaClient } from './supaClient';
import { Drawer, Profile, DriverDrawer, Order, NewOrder, OrderOrigin } from './typesAndValidators';
import { z } from 'zod';

type DirtyDriverDrawer = { drawer: Drawer; driver: Profile };

export const getAllDrawers = async () => {
    const { data, error } = await supaClient.from('Drawer').select('*').neq('drawer_type', 'driver');

    if (error) {
        console.error(error);
        return [] as Drawer[];
    }

    return data as unknown as Drawer[];
};

const convertToDriverDrawer = (dirtyDriverDrawer: DirtyDriverDrawer): DriverDrawer => {
    return {
        ...dirtyDriverDrawer.drawer,
        driver: dirtyDriverDrawer.driver,
    };
};

export const getAllDrivers = async () => {
    const { data, error } = await supaClient.from('Driver').select('drawer:Drawer(*), driver:Profile(*)');

    if (error) {
        console.error(error);
        return [] as DriverDrawer[];
    }

    return data.map((d) => convertToDriverDrawer(d as unknown as DirtyDriverDrawer));
};

export const getAllOrigins = async () => {
    const { data, error } = await supaClient.from('OrderOrigin').select('*').order('name', { ascending: true });
    if (error) {
        console.error(error);
        return [] as OrderOrigin[];
    }

    return data as unknown as OrderOrigin[];
};

interface GetAllDaysOrdersProps {
    year: number;
    month: number;
    day: number;
}

const supabaseDate = z.object({
    year: z.number().min(2024).max(2100),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
});

export const getAllDaysOrders = async ({ year, month, day }: GetAllDaysOrdersProps) => {
    console.log(`getting orders for ${month}/${day}/${year}`);
    try {
        supabaseDate.parse({ year, month, day });
    } catch (error) {
        console.error(error);
        return [] as Order[];
    }
    const { data, error } = await supaClient
        .from('Order')
        .select('*')
        .eq('business_date', `${year}-${month}-${day}`)
        .order('order_number', { ascending: true });

    if (error) {
        console.error(error);
        return [] as Order[];
    }

    return data as unknown as Order[];
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
    if (error) {
        console.error(error);
        throw error;
    }

    if (!data) {
        return null;
    }

    return data[0] as unknown as Order;
};

export const updateOrder = async (order: Order) => {
    const { data, error } = await supaClient.from('Order').update(order).eq('order_id', order.order_id).select();
    if (error) {
        console.error(error);
        throw error;
    }

    if (!data) {
        return null;
    }

    return data[0] as unknown as Order;
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
        console.log(data);
        return data;
    }
};

export const removeOrdersFromDrawer = async ({ orderIDs, drawerID }: { orderIDs: string[]; drawerID: string }) => {
    const { data, error } = await supaClient.rpc('remove_orders_from_drawer', {
        p_drawer_id: drawerID,
        p_order_ids: orderIDs,
    });
    if (error) {
        console.error(error);
    } else {
        console.log(data);
        return data;
    }
};
