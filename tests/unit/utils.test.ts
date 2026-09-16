import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import {
    capitalizeFirstWord,
    dayjsToMDY,
    formatCurrency,
    getDrawerFullName,
    getRunningTotal,
    isValidDrawer,
    nonZeroModulo,
    normalizeEmail,
    sortOrders,
} from '../../src/utils';
import type { Drawer, Driver_Drawer, Order_Payment } from '../../src/typesAndValidators';

const drawer = (drawer_type: Drawer['drawer_type'], drawer_id = 'drawer-1') =>
    ({ drawer_id, drawer_type, name: 'Register 1' }) as unknown as Drawer;

const driverDrawer = (first_name: string, last_name: string) =>
    ({
        drawer_id: 'drawer-driver',
        drawer_type: 'driver',
        driver: { first_name, last_name },
    }) as unknown as Driver_Drawer;

const order = (fields: { order_number?: number | null; order_name?: string | null }) =>
    fields as unknown as Order_Payment;

describe('formatCurrency', () => {
    it('renders cents as dollars', () => {
        expect(formatCurrency(0)).toBe('$0.00');
        expect(formatCurrency(5)).toBe('$0.05');
        expect(formatCurrency(1234)).toBe('$12.34');
        expect(formatCurrency(100000)).toBe('$1000.00');
    });

    it('puts the minus sign before the dollar sign', () => {
        expect(formatCurrency(-1234)).toBe('-$12.34');
    });

    it('only adds a plus sign when asked', () => {
        expect(formatCurrency(1234, true)).toBe('+$12.34');
        expect(formatCurrency(0, true)).toBe('+$0.00');
    });

    it('never shows a plus sign on a negative amount', () => {
        expect(formatCurrency(-1234, true)).toBe('-$12.34');
    });
});

describe('isValidDrawer', () => {
    it('accepts anything when there is no drawer yet', () => {
        expect(isValidDrawer(null, false, 'delivery')).toBe(true);
    });

    it('pins the order to a specific drawer when a driver drawer id is given', () => {
        expect(isValidDrawer(drawer('driver', 'drawer-1'), false, 'delivery', 'drawer-1')).toBe(true);
        expect(isValidDrawer(drawer('driver', 'drawer-1'), false, 'delivery', 'drawer-2')).toBe(false);
    });

    it('routes deliveries to driver drawers only', () => {
        expect(isValidDrawer(drawer('driver'), false, 'delivery')).toBe(true);
        expect(isValidDrawer(drawer('register'), false, 'delivery')).toBe(false);
        expect(isValidDrawer(drawer('third_party'), true, 'delivery')).toBe(false);
    });

    it('routes third-party pickups to third-party drawers', () => {
        expect(isValidDrawer(drawer('third_party'), true, 'pickup')).toBe(true);
        expect(isValidDrawer(drawer('register'), true, 'pickup')).toBe(false);
    });

    it('routes in-house pickups to the register', () => {
        expect(isValidDrawer(drawer('register'), false, 'pickup')).toBe(true);
        expect(isValidDrawer(drawer('third_party'), false, 'pickup')).toBe(false);
    });
});

describe('getDrawerFullName', () => {
    it('returns an empty string for no drawer', () => {
        expect(getDrawerFullName(null)).toBe('');
    });

    it('uses the driver name for driver drawers', () => {
        expect(getDrawerFullName(driverDrawer('Ada', 'Lovelace'))).toBe('Ada Lovelace');
    });

    it('uses the drawer name for non-driver drawers', () => {
        expect(getDrawerFullName(drawer('register'))).toBe('Register 1');
    });
});

describe('sortOrders', () => {
    it('sorts numbered orders by number', () => {
        expect(sortOrders(order({ order_number: 1 }), order({ order_number: 2 }))).toBeLessThan(0);
        expect(sortOrders(order({ order_number: 5 }), order({ order_number: 2 }))).toBeGreaterThan(0);
    });

    it('puts numbered orders ahead of named ones', () => {
        expect(sortOrders(order({ order_number: 1 }), order({ order_name: 'Walk-in' }))).toBe(-1);
        expect(sortOrders(order({ order_name: 'Walk-in' }), order({ order_number: 1 }))).toBe(1);
    });

    it('falls back to comparing names', () => {
        expect(sortOrders(order({ order_name: 'Ana' }), order({ order_name: 'Bob' }))).toBeLessThan(0);
        expect(sortOrders(order({}), order({}))).toBe(0);
    });

    it('orders a realistic mixed list', () => {
        const orders = [
            order({ order_name: 'Bob' }),
            order({ order_number: 3 }),
            order({ order_name: 'Ana' }),
            order({ order_number: 1 }),
        ];
        expect([...orders].sort(sortOrders)).toEqual([
            order({ order_number: 1 }),
            order({ order_number: 3 }),
            order({ order_name: 'Ana' }),
            order({ order_name: 'Bob' }),
        ]);
    });
});

describe('getRunningTotal', () => {
    it('accumulates values', () => {
        expect(getRunningTotal([1, 2, 3])).toEqual([1, 3, 6]);
    });

    it('handles a single value', () => {
        expect(getRunningTotal([5])).toEqual([5]);
    });

    it('handles cash going back out of the drawer', () => {
        expect(getRunningTotal([10000, -2500, 500])).toEqual([10000, 7500, 8000]);
    });
});

describe('nonZeroModulo', () => {
    it('behaves like modulo when there is a remainder', () => {
        expect(nonZeroModulo(7, 3)).toBe(1);
    });

    it('returns the divisor instead of zero so a full row is never blank', () => {
        expect(nonZeroModulo(6, 3)).toBe(3);
        expect(nonZeroModulo(3, 3)).toBe(3);
        expect(nonZeroModulo(0, 3)).toBe(3);
    });
});

describe('normalizeEmail', () => {
    it('trims and lowercases', () => {
        expect(normalizeEmail('  Foo@Bar.COM ')).toBe('foo@bar.com');
    });

    it('treats missing values as empty', () => {
        expect(normalizeEmail(null)).toBe('');
        expect(normalizeEmail(undefined)).toBe('');
    });
});

describe('dayjsToMDY', () => {
    it('returns a 1-based month', () => {
        expect(dayjsToMDY(dayjs('2026-09-16'))).toEqual({ month: 9, day: 16, year: 2026 });
    });

    it('handles January and December', () => {
        expect(dayjsToMDY(dayjs('2026-01-01'))).toEqual({ month: 1, day: 1, year: 2026 });
        expect(dayjsToMDY(dayjs('2026-12-31'))).toEqual({ month: 12, day: 31, year: 2026 });
    });
});

describe('capitalizeFirstWord', () => {
    it('capitalizes only the first character', () => {
        expect(capitalizeFirstWord('hello world')).toBe('Hello world');
    });

    it('leaves an empty string alone', () => {
        expect(capitalizeFirstWord('')).toBe('');
    });
});
