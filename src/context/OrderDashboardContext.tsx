import { createContext } from 'react';
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
        some: {
            areSelected: boolean;
            areCollapsed: boolean;
        };
    };
    drawer: {
        onClick: (drawer: Drawer | DriverDrawer) => void;
        removeOrders: () => void;
        current: Drawer | DriverDrawer | null;
    };
    orders: {
        forCurrentDrawer: Order[];
        all: Order[];
        byDrawerID: (drawerID: string) => Order[];
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
        some: {
            areSelected: false,
            areCollapsed: false,
        },
    },
    drawer: {
        onClick: () => {},
        removeOrders: () => {},
        current: null,
    },
    orders: {
        forCurrentDrawer: [],
        all: [],
        byDrawerID: () => [],
    },
});
