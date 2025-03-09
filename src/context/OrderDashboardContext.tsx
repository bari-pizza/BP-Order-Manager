import { createContext, RefObject } from 'react';
import type { BusinessDayDrawerSummary, Drawer, Driver_Drawer, Order_Payment } from '../typesAndValidators';

interface OrderDashboardContextProps {
    ticket: {
        select: (order: Order_Payment) => void;
        isSelected: (order: Order_Payment) => boolean;
        all: {
            select: () => void;
            areSelected: boolean;
            count: number;
        };
        none: {
            areSelected: boolean;
        };
        count: {
            selected: number;
        };
        refs: {
            [key: string]: RefObject<SVGSVGElement>;
        };
    };
    summaries: {
        all: BusinessDayDrawerSummary[];
        forCurrentDrawer: BusinessDayDrawerSummary | null;
        byDrawerID: (drawerID: string) => BusinessDayDrawerSummary | null;
        update: (summary: BusinessDayDrawerSummary) => void;
    };
    drawer: {
        onClick: (drawer: Drawer | Driver_Drawer) => void;
        removeOrders: () => void;
        current: Drawer | Driver_Drawer | null;
        unassigned: Drawer;
        isUnassignedDrawer: boolean;
        refs: {
            [key: string]: RefObject<HTMLDivElement>;
        };
    };
    orders: {
        forCurrentDrawer: Order_Payment[];
        all: Order_Payment[];
        byDrawerID: (drawerID: string) => Order_Payment[];
        isRepeat: (nameOrNumber: string | number | null, isStatic?: boolean) => boolean;
    };
    drivers: {
        all: Driver_Drawer[];
        todays: Driver_Drawer[];
    };
}

export const OrderDashboardContext = createContext<OrderDashboardContextProps>({
    ticket: {
        select: () => {},
        isSelected: () => false,
        all: {
            select: () => {},
            areSelected: false,
            count: 0,
        },
        none: {
            areSelected: true,
        },
        count: {
            selected: 0,
        },
        refs: {},
    },
    summaries: {
        all: [],
        forCurrentDrawer: null,
        byDrawerID: () => null,
        update: () => {},
    },
    drawer: {
        onClick: () => {},
        removeOrders: () => {},
        current: null,
        unassigned: {
            drawer_id: 'unassigned',
            name: 'Unassigned',
            created_at: '2024-08-27T00:00:00.000Z',
            drawer_type: 'unassigned',
            is_deleted: false,
        },
        isUnassignedDrawer: true,
        refs: {},
    },
    orders: {
        forCurrentDrawer: [],
        all: [],
        byDrawerID: () => [],
        isRepeat: () => false,
    },
    drivers: {
        all: [],
        todays: [],
    },
});

// For current business day's orders, drawers, tickets, and their interactions
