import { Tables } from './supabase';

type ValueOf<Obj> = Obj[keyof Obj];
type OneOnly<Obj, Key extends keyof Obj> = { [key in Exclude<keyof Obj, Key>]: null } & Pick<Obj, Key>;
type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };
export type OneOfType<Obj> = ValueOf<OneOfByKey<Obj>>;

export type Profile = Tables<'Profile'>;
export type Employee = Profile & { is_driver: boolean };
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
export type BusinessDayDrawerSummary = Tables<'BusinessDayDrawer'>;
export type CashTransfer = Tables<'CashTransfer'>;
export type CashTransferType = Tables<'CashTransfer'>['transfer_type'];
export type AppSetting = Tables<'AppSetting'>;
export type BusinessDaySummary = Tables<'BusinessDaySummary'>;
export type GlobalChangeTracker = Tables<'GlobalChangeTracker'>;

export type NewProfile = Omit<Profile, 'id' | 'created_at'>;
export type NewDrawer = Omit<Drawer, 'drawer_id' | 'created_at'>;
export type NewOrder = Omit<Order, 'order_id' | 'created_at'>;
export type NewPayment = Omit<Payment, 'payment_id' | 'created_at'>;
export type NewCashTransfer = Omit<CashTransfer, 'cash_transfer_id' | 'created_at'>;

export type OrderWithFullDetails = Order_Payment & {
    drawer?: Drawer;
    driver?: Driver_Drawer;
    origin: OrderOrigin;
};

export type PaymentWithFullDetails = Payment & {
    drawer?: Drawer;
    driver?: Driver_Drawer;
    order: Order_Payment;
    origin: OrderOrigin;
};

export type AdminDashboardTabName = 'employees' | 'origins' | 'orders' | 'settings';
export type ManagerDashboardTabName = 'sales' | 'drawers' | 'orders' | 'cards' | 'settings';
export type LocalStorageField = {
    adminDashboardTabName: AdminDashboardTabName;
    managerDashboardTabName: ManagerDashboardTabName;
    openDrawer: Drawer | Driver_Drawer;
};

export type BucketName = 'avatars' | 'order_origins';

const orderValidators = {
    order_number: {
        validate: (value: number | null) => {
            if (value === null) {
                return 'Must be a number';
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
            if (value < 0) {
                return 'Cannot be negative';
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
