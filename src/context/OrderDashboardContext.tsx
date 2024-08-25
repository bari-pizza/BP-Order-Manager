import { createContext } from 'react';
import type { Drawer, DriverDrawer } from '../typesAndValidators';

interface OrderDashboardContextProps {
    openDrawer: Drawer | DriverDrawer | null;
    handleDrawerClick: (drawer: Drawer | DriverDrawer) => void;
}

export const OrderDashboardContext = createContext<OrderDashboardContextProps>({
    openDrawer: null,
    handleDrawerClick: () => {},
});
