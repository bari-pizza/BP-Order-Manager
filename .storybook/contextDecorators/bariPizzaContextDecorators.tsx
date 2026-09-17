import { BariPizzaContext, emptyShopContext } from '../../src/context/BariPizzaContext';
import { createContextDecorator } from '.';
import { dummyDrawers } from '../../src/dummyData';
import type { OrderOrigin, Resource } from '../../src/typesAndValidators';
import {
    DEFAULT_ORIGIN_RESOURCE_TITLE,
    IN_HOUSE_ORIGIN_RESOURCE_TITLE,
    mergeResourcesWithDefaults,
} from '../../src/constants/resources';
import avatarImage from '../../src/assets/add-user.png';

const { drawers, drivers } = dummyDrawers;

const resources: Resource[] = mergeResourcesWithDefaults([
    { title: IN_HOUSE_ORIGIN_RESOURCE_TITLE, src: avatarImage, bucket_name: 'resources' },
    { title: DEFAULT_ORIGIN_RESOURCE_TITLE, src: avatarImage, bucket_name: 'resources' },
    { title: 'Register', src: avatarImage, bucket_name: 'resources' },
    { title: 'Third Party Pickup', src: avatarImage, bucket_name: 'resources' },
    { title: 'Unassigned Drawer', src: avatarImage, bucket_name: 'resources' },
    { title: 'Missing Avatar', src: avatarImage, bucket_name: 'resources' },
    { title: 'Add Driver', src: avatarImage, bucket_name: 'resources' },
]);

const origins: OrderOrigin[] = [
    {
        origin_id: 'origin-in-house',
        name: 'Bari Pizza',
        icon: avatarImage,
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
    resources,
};

export default {
    default: createContextDecorator(BariPizzaContext, shopValue),
    noDrivers: createContextDecorator(BariPizzaContext, { ...shopValue, drivers: [] }),
};
