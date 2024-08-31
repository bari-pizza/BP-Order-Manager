import { createContext } from 'react';
import { Drawer, DriverDrawer, Order, OrderOrigin } from '../typesAndValidators';

interface ManagerDashboardProps {
    // all orders, drivers, and origins are already provided by BariPizzaContext
    // take parts of BariPizzaContext that are needed and pass them down to ManagerDashboard
    // drawers and origins from BariPizzaContext
    drawers: Drawer[];
    origins: OrderOrigin[];
    driver: {
        all: DriverDrawer[];
        todays: DriverDrawer[];
        current: DriverDrawer | null;
        add: (driver: DriverDrawer) => void;
        remove: (driver: DriverDrawer) => void;
        close: (driver: DriverDrawer) => void;
        reOpen: (driver: DriverDrawer) => void;
    };
    orders: {
        all: Order[];
        forCurrentDrawer: Order[];
        byDrawerID: (drawerID: string) => Order[];
        // maybe add by date range for reporting?
    };
}

export const ManagerDashboardContext = createContext<ManagerDashboardProps>({} as ManagerDashboardProps);
