import { createContext } from 'react';
import type { Drawer, DriverDrawer, OrderOrigin } from '../typesAndValidators';

interface BusinessDayContextProps {
    drawers: Drawer[];
    drivers: DriverDrawer[];
    origins: OrderOrigin[];
}

export const BusinessDayContext = createContext<BusinessDayContextProps>({
    drawers: [],
    drivers: [],
    origins: [],
});
