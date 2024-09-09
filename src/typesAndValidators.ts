import { Tables } from './supabase';

export type Profile = Tables<'Profile'>;
export type Drawer = Tables<'Drawer'>;
export type DrawerType = Tables<'Drawer'>['drawer_type'];
export type Driver_Drawer = Drawer & { driver: Profile };
export type Driver = Tables<'Driver'>;
export type Order = Tables<'Order'>;
export type OrderOrigin = Tables<'OrderOrigin'>;
export type OrderType = Tables<'Order'>['order_type'];
export type BusinessDayDriver = Tables<'BusinessDayDriver'>;
export type Payment = Tables<'Payment'>;
export type Order_Payment = Order & { payments: Payment[] };
export type PaymentType = Tables<'Payment'>['payment_type'];

export type NewProfile = Omit<Profile, 'id' | 'created_at'>;
export type NewDrawer = Omit<Drawer, 'drawer_id' | 'created_at'>;
export type NewOrder = Omit<Order, 'order_id' | 'created_at'>;
export type NewPayment = Omit<Payment, 'payment_id' | 'created_at'>;

export type AdminDashboardTabName = 'employees' | 'third_parties' | 'orders' | 'settings';
export type ManagerDashboardTabName = 'sales' | 'drivers' | 'orders' | 'settings';
export type LocalStorageField = {
    adminDashboardTabName: AdminDashboardTabName;
    managerDashboardTabName: ManagerDashboardTabName;
    openDrawer: Drawer | Driver_Drawer;
};

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
    phone: {
        validate: (value: string | null) => {
            if (value === null) {
                return true;
            }
            if (value.length < 5) {
                return 'Must be at least 5 characters';
            }
            return true;
        },
        setValueAs: (value: string | null) => (value === '' || value === null ? null : value),
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
    delivery_fee_in_cents: {
        validate: (value: number) => {
            if (isNaN(value)) {
                return 'Must be a number';
            }
            if (!Number.isInteger(value)) {
                return 'Must be a whole number';
            }
            if (value < 0) {
                return 'Cannot be negative';
            }
            return true;
        },
        valueAsNumber: true,
    },
};

const paymentValidators = {
    amount_in_cents: {
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
    tip_in_cents: {
        validate: (value: number) => {
            if (isNaN(value)) {
                return 'Must be a number';
            }
            if (!Number.isInteger(value)) {
                return 'Must be a whole number';
            }
            if (value < 0) {
                return 'Cannot be negative';
            }
            return true;
        },
        valueAsNumber: true,
    },
};

export const validators = {
    order: orderValidators,
    payment: paymentValidators,
};
