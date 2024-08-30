import { createContext } from 'react';
import type { Drawer, DriverDrawer, OrderOrigin } from '../typesAndValidators';

interface BariPizzaContextProps {
    drawers: Drawer[];
    drivers: DriverDrawer[];
    origins: OrderOrigin[];
}

export const BariPizzaContext = createContext<BariPizzaContextProps>({
    drawers: [],
    drivers: [],
    origins: [],
});

// For all drawers, drivers, and origins
