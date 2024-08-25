import { Tables } from './supabase';

export type Profile = Tables<'Profile'>;
export type Drawer = Tables<'Drawer'>;
export type DrawerType = Tables<'Drawer'>['drawer_type'];
export type DriverDrawer = Drawer & { driver: Profile };
export type Order = Tables<'Order'>;
export type NewOrder = Omit<Order, 'order_id' | 'created_at'>;
export type OrderOrigin = Tables<'OrderOrigin'>;

const orderValidators = {
    order_number: {
        validate: (value: number | null) => {
            if (value === null) {
                return true;
            }
            if (isNaN(value)) {
                return 'Must be a number';
            }
            if (!Number.isInteger(value)) {
                return 'Must be a whole number';
            }
            if (value < 1) {
                return 'Must be greater than 0';
            }
            if (value >= 1000) {
                return 'Must be less than 1000';
            }
            return true;
        },
        setValueAs: (value: string | null) => (value === '' || value === null ? null : Number(value)),
    },
    total_in_cents: {
        validate: (value: number) => {
            if (isNaN(value)) {
                return 'Must be a number';
            }
            if (!Number.isInteger(value)) {
                return 'Must be a whole number';
            }
            if (value < 1) {
                return 'Must be greater than 0';
            }
            return true;
        },
        valueAsNumber: true,
    },
};

export const validators = {
    order: orderValidators,
};
