import { supaClient } from './supaClient';
import { Tables } from './supabase';
import { z } from 'zod';

export type Profile = Tables<'Profile'>;
export type Drawer = Tables<'Drawer'>;
export type DrawerType = Tables<'Drawer'>['drawer_type'];
export type DriverDrawer = Drawer & { driver: Profile };
export type Order = Tables<'Order'>;
export type NewOrder = Omit<Order, 'order_id' | 'created_at'>;

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
    const { data, error } = await supaClient.from('Order').select('*').eq('business_date', `${year}-${month}-${day}`);

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

export const dummyQueryFn = async <T>({ timeout = 1000, data = [] }: DummyQueryFnProps<T> = {}): Promise<T[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, timeout);
    });
};

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
    // TODO: create a mutation to update an order
    console.log({ order });
};
