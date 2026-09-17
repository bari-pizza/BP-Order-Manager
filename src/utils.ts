import type { Drawer, Driver_Drawer, Order_Payment, OrderType } from './typesAndValidators';
import dayjs from 'dayjs';
import { cloneElement, isValidElement } from 'react';

export const isValidDrawer = (
    drawer: Drawer | Driver_Drawer | null,
    is_third_party: boolean,
    order_type: OrderType,
    driverDrawerID?: string,
) => {
    if (!drawer) {
        return true;
    }
    const { drawer_type } = drawer;

    if (driverDrawerID) {
        return drawer.drawer_id === driverDrawerID;
    }

    if (order_type === 'delivery' && drawer_type === 'driver') {
        return true;
    }
    if (order_type === 'pickup') {
        if (is_third_party && drawer_type === 'third_party') {
            return true;
        }
        if (!is_third_party && drawer_type === 'register') {
            return true;
        }
    }
    return false;
};

export const getDrawerFullName = (drawer: Drawer | Driver_Drawer | null) => {
    if (!drawer) {
        return '';
    }
    if ('driver' in drawer) {
        return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
    }
    return drawer.name;
};

export const formatCurrency = (cents: number, includePositiveSign = false) => {
    const sign = cents < 0 ? '-' : includePositiveSign ? '+' : '';
    return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
};

export const sortOrders = (a: Order_Payment, b: Order_Payment) => {
    // sort by order number first
    // then sort by order name
    if (a?.order_number) {
        if (b?.order_number) {
            return a.order_number - b.order_number;
        } else {
            return -1;
        }
    }

    if (b?.order_number) {
        return 1;
    }

    if (a?.order_name && b?.order_name) {
        return a.order_name.localeCompare(b.order_name);
    }
    return 0;
};

export const dayjsToMDY = (date: dayjs.Dayjs) => {
    const month = date.month() + 1;
    const day = date.date();
    const year = date.year();
    return { month, day, year };
};

export const getRunningTotal = (values: number[]) => {
    const runningTotal = [values[0]];
    for (let i = 1; i < values.length; i++) {
        const lastValue = runningTotal[i - 1];
        runningTotal.push(lastValue + values[i]);
    }
    return runningTotal;
};

export const nonZeroModulo = (a: number, b: number) => {
    const c = a % b;
    return c === 0 ? b : c;
};

/** Supabase auth treats emails as case-insensitive; match that when looking up or signing in. */
export const normalizeEmail = (email: string | null | undefined) => (email ?? '').trim().toLowerCase();

export const getEnv = (variableName: string): string => {
    if (variableName === 'MODE') {
        const mode = import.meta.env.MODE;
        if (mode) return mode;
        // Node/test only — `process` is not defined in the browser
        if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
            return process.env.NODE_ENV;
        }
        return '';
    }

    const fromVite = import.meta.env[variableName];
    if (fromVite != null && fromVite !== '') return String(fromVite);

    if (typeof process !== 'undefined' && process.env?.[variableName]) {
        return process.env[variableName] as string;
    }

    return '';
};

export const devOnly = (child: React.ReactElement) => {
    if (getEnv('MODE') === 'development') {
        if (isValidElement(child)) {
            return cloneElement(child, {
                // @ts-expect-error ignore
                style: {
                    // @ts-expect-error ignore
                    ...child.props.style,
                    border: '2px solid red',
                },
            });
        }
        return child; // Return the child as is if not a valid element
    }
    return null;
};

export const capitalizeFirstWord = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
