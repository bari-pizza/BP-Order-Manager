import { createContext } from 'react';
import type { Drawer, Driver_Drawer, OrderOrigin, Resource } from '../typesAndValidators';

interface BariPizzaContextProps {
    drawers: Drawer[];
    drivers: Driver_Drawer[];
    origins: OrderOrigin[];
    resources: Resource[];
    constants: {
        default: {
            delivery_fee_in_cents: number;
            driver_starting_cash_in_cents: number;
            driver_hourly_wage_in_cents: number;
            register_starting_cash_in_cents: number;
            register_for_bank_transfers: string;
            register_for_cash_transfers: string;
        };
    };
}

export const BariPizzaContext = createContext<BariPizzaContextProps>({
    drawers: [],
    drivers: [],
    origins: [],
    resources: [],
    constants: {
        default: {
            delivery_fee_in_cents: 300,
            driver_starting_cash_in_cents: 2000,
            driver_hourly_wage_in_cents: 500,
            register_starting_cash_in_cents: 10000,
            register_for_bank_transfers: 'feb2fc5d-19bd-42ab-b16e-38f12c86ce6a',
            register_for_cash_transfers: 'feb2fc5d-19bd-42ab-b16e-38f12c86ce6a',
        },
    },
});

// For all drawers, drivers, and origins
