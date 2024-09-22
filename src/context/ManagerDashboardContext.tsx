import { createContext } from 'react';
import { BusinessDayDrawerSummary, Drawer, Driver_Drawer, Order_Payment, OrderOrigin } from '../typesAndValidators';

interface ManagerDashboardProps {
    // all orders, drivers, and origins are already provided by BariPizzaContext
    // take parts of BariPizzaContext that are needed and pass them down to ManagerDashboard
    // drawers and origins from BariPizzaContext
    drawers: {
        all: Drawer[];
        onClick: (drawer: Drawer | Driver_Drawer) => void;
        current: Drawer | Driver_Drawer | null;
        close: (drawer: Drawer | Driver_Drawer) => void;
        reOpen: (drawer: Drawer | Driver_Drawer) => void;
    };
    origins: OrderOrigin[];
    drivers: {
        all: Driver_Drawer[];
        todays: Driver_Drawer[];
        available: Driver_Drawer[];
        current: Driver_Drawer | null;
        add: (driver: Driver_Drawer) => void;
        remove: (driver: Driver_Drawer) => void;
        handleClick: (driver: Driver_Drawer) => void;
    };
    summaries: {
        all: BusinessDayDrawerSummary[];
        forCurrentDrawer: BusinessDayDrawerSummary | null;
        byDrawerID: (drawerID: string) => BusinessDayDrawerSummary | null;
        update: (summary: BusinessDayDrawerSummary) => void;
    };
    combinedDrawersAndDrivers: (Drawer | Driver_Drawer)[];
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
        current: null,
        close: () => {},
        reOpen: () => {},
    },
    origins: [],
    drivers: {
        all: [],
        todays: [],
        available: [],
        current: null,
        add: () => {},
        remove: () => {},
        handleClick: () => {},
    },
    summaries: {
        all: [],
        forCurrentDrawer: null,
        byDrawerID: () => null,
        update: () => {},
    },
    combinedDrawersAndDrivers: [],
    orders: {
        all: [],
        forCurrentDrawer: [],
        byDrawerID: () => [],
    },
});
