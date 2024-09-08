import { createContext } from 'react';
import type { Drawer, Driver_Drawer, OrderOrigin } from '../typesAndValidators';

interface BariPizzaContextProps {
    drawers: Drawer[];
    drivers: Driver_Drawer[];
    origins: OrderOrigin[];
}

export const BariPizzaContext = createContext<BariPizzaContextProps>({
    drawers: [],
    drivers: [],
    origins: [],
});

// For all drawers, drivers, and origins
