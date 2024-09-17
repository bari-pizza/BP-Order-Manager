import { createContext, RefObject } from 'react';
import type { BusinessDayDrawerSummary, Drawer, Driver_Drawer, Order_Payment } from '../typesAndValidators';

interface OrderDashboardContextProps {
    ticket: {
        select: (order: Order_Payment) => void;
        collapse: (order: Order_Payment) => void;
        isCollapsed: (order: Order_Payment) => boolean;
        isSelected: (order: Order_Payment) => boolean;
        all: {
            select: () => void;
            collapse: () => void;
            areCollapsed: boolean;
            areSelected: boolean;
            count: number;
        };
        none: {
            areSelected: boolean;
            areCollapsed: boolean;
        };
        count: {
            selected: number;
            collapsed: number;
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
    };
    drivers: {
        all: Driver_Drawer[];
        todays: Driver_Drawer[];
    };
}

export const OrderDashboardContext = createContext<OrderDashboardContextProps>({
    ticket: {
        select: () => {},
        collapse: () => {},
        isCollapsed: () => false,
        isSelected: () => false,
        all: {
            select: () => {},
            collapse: () => {},
            areCollapsed: false,
            areSelected: false,
            count: 0,
        },
        none: {
            areSelected: true,
            areCollapsed: true,
        },
        count: {
            selected: 0,
            collapsed: 0,
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
        },
        isUnassignedDrawer: true,
        refs: {},
    },
    orders: {
        forCurrentDrawer: [],
        all: [],
        byDrawerID: () => [],
    },
    drivers: {
        all: [],
        todays: [],
    },
});

// For current business day's orders, drawers, tickets, and their interactions
