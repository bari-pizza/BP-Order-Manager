import { createContext } from 'react';
import type { Drawer, Driver_Drawer, OrderOrigin } from '../typesAndValidators';

interface BariPizzaContextProps {
    drawers: Drawer[];
    drivers: Driver_Drawer[];
    origins: OrderOrigin[];
    constants: {
        default: {
            delivery_fee_in_cents: number;
        };
    };
}

export const BariPizzaContext = createContext<BariPizzaContextProps>({
    drawers: [],
    drivers: [],
    origins: [],
    constants: {
        default: {
            delivery_fee_in_cents: 300,
        },
    },
});

// For all drawers, drivers, and origins
