import { Drawer, Driver_Drawer, Order_Payment } from './typesAndValidators';
import dayjs from 'dayjs';

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

export const getEnv = (variableName: string): string => {
    if (variableName === 'MODE') {
        return import.meta.env.MODE || (process.env.NODE_ENV as string);
    }
    if (import.meta.env.MODE === 'development') {
        return import.meta.env[variableName] || process.env[variableName];
    } else {
        // In production, only check import.meta.env
        return import.meta.env[variableName];
    }
};
