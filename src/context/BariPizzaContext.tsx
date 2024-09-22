import { createContext } from 'react';
import type { Drawer, Driver_Drawer, OrderOrigin } from '../typesAndValidators';

interface BariPizzaContextProps {
    drawers: Drawer[];
    drivers: Driver_Drawer[];
    origins: OrderOrigin[];
    constants: {
        default: {
            delivery_fee_in_cents: number;
            starting_cash_in_cents: number;
            driver_hourly_wage_in_cents: number;
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
            starting_cash_in_cents: 2000,
            driver_hourly_wage_in_cents: 500,
        },
    },
});

// For all drawers, drivers, and origins
