import { BariPizzaContext, emptyShopContext } from '../../src/context/BariPizzaContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';
import { storyOriginsList, storyResources } from '../fixtures/resources';

const { drawers, drivers } = dummyDrawers;

const shopValue = {
    ...emptyShopContext,
    drawers,
    drivers: drivers.slice(0, 3),
    origins: storyOriginsList,
    resources: storyResources,
};

export default {
    default: createContextDecorator(BariPizzaContext, shopValue),
    noDrivers: createContextDecorator(BariPizzaContext, { ...shopValue, drivers: [] }),
};
