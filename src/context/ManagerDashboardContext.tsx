import { createContext } from 'react';
import { Drawer, Driver_Drawer, Order_Payment, OrderOrigin } from '../typesAndValidators';

interface ManagerDashboardProps {
    // all orders, drivers, and origins are already provided by BariPizzaContext
    // take parts of BariPizzaContext that are needed and pass them down to ManagerDashboard
    // drawers and origins from BariPizzaContext
    drawers: {
        all: Drawer[];
        onClick: (drawer: Drawer | Driver_Drawer) => void;
    };
    origins: OrderOrigin[];
    drivers: {
        all: Driver_Drawer[];
        todays: Driver_Drawer[];
        available: Driver_Drawer[];
        current: Driver_Drawer | null;
        add: (driver: Driver_Drawer) => void;
        remove: (driver: Driver_Drawer) => void;
        close: (driver: Driver_Drawer) => void;
        reOpen: (driver: Driver_Drawer) => void;
        handleClick: (driver: Driver_Drawer) => void;
    };
    orders: {
        all: Order_Payment[];
        forCurrentDrawer: Order_Payment[];
        byDrawerID: (drawerID: string) => Order_Payment[];
    };
}

export const ManagerDashboardContext = createContext<ManagerDashboardProps>({
    drawers: {
        all: [],
        onClick: () => {},
    },
    origins: [],
    drivers: {
        all: [],
        todays: [],
        available: [],
        current: null,
        add: () => {},
        remove: () => {},
        close: () => {},
        reOpen: () => {},
        handleClick: () => {},
    },
    orders: {
        all: [],
        forCurrentDrawer: [],
        byDrawerID: () => [],
    },
});
