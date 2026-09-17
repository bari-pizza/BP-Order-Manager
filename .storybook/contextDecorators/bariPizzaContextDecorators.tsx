import { BariPizzaContext, emptyShopContext } from '../../src/context/BariPizzaContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';
import type { OrderOrigin } from '../../src/typesAndValidators';
import { resourceSrc, storyResources } from '../fixtures/resources';

const { drawers, drivers } = dummyDrawers;

const origins: OrderOrigin[] = [
    {
        origin_id: 'origin-in-house',
        name: 'Bari Pizza',
        icon: resourceSrc.bariPizza,
        is_third_party: false,
        can_deliver: true,
        can_tip: true,
        has_order_number: true,
        is_prepaid_toggleable: true,
        default_is_prepaid: false,
        is_deleted: false,
    },
    {
        origin_id: 'origin-doordash',
        name: 'DoorDash',
        icon: '',
        is_third_party: true,
        can_deliver: true,
        can_tip: false,
        has_order_number: true,
        is_prepaid_toggleable: false,
        default_is_prepaid: true,
        is_deleted: false,
    },
];

const shopValue = {
    ...emptyShopContext,
    drawers,
    drivers: drivers.slice(0, 3),
    origins,
    resources: storyResources,
};

export default {
    default: createContextDecorator(BariPizzaContext, shopValue),
    noDrivers: createContextDecorator(BariPizzaContext, { ...shopValue, drivers: [] }),
};
