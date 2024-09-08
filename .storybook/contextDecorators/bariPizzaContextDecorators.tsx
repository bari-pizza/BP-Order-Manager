import { BariPizzaContext } from '../../src/context/BariPizzaContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';

const { drawers, drivers } = dummyDrawers;

// TODO: add origins

export default {
    default: createContextDecorator(BariPizzaContext, {
        drawers,
        drivers: drivers.slice(0, 3),
        origins: [],
    }),
    noDrivers: createContextDecorator(BariPizzaContext, { drawers, drivers: [], origins: [] }),
};
