import { createContext, RefObject } from 'react';
import type { Drawer, DriverDrawer, Order } from '../typesAndValidators';

interface OrderDashboardContextProps {
    ticket: {
        select: (order: Order) => void;
        collapse: (order: Order) => void;
        isCollapsed: (order: Order) => boolean;
        isSelected: (order: Order) => boolean;
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
    drawer: {
        onClick: (drawer: Drawer | DriverDrawer) => void;
        removeOrders: () => void;
        current: Drawer | DriverDrawer | null;
        unassigned: Drawer;
        isUnassignedDrawer: boolean;
        refs: {
            [key: string]: RefObject<HTMLDivElement>;
        };
    };
    orders: {
        forCurrentDrawer: Order[];
        all: Order[];
        byDrawerID: (drawerID: string) => Order[];
    };
    drivers: {
        all: DriverDrawer[];
        todays: DriverDrawer[];
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
