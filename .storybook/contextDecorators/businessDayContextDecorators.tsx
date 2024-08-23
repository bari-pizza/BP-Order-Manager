import { BusinessDayContext } from '../../src/context/BusinessDayContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';

const { drawers, drivers } = dummyDrawers;

export default {
    default: createContextDecorator(BusinessDayContext, {
        drawers,
        drivers: drivers.slice(0, 3),
    }),
    noDrivers: createContextDecorator(BusinessDayContext, { drawers, drivers: [] }),
};
