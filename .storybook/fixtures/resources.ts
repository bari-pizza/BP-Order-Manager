/**
 * Real shop Resource images (checked into `src/assets/resources/`).
 * Prefer these over placeholders so Storybook matches what drivers/managers see.
 */
import bariPizza from '../../src/assets/resources/bari-pizza.png';
import defaultOrigin from '../../src/assets/resources/default-origin.png';
import register from '../../src/assets/resources/register.png';
import thirdPartyPickup from '../../src/assets/resources/third-party-pickup.png';
import unassignedDrawer from '../../src/assets/resources/unassigned-drawer.png';
import missingAvatar from '../../src/assets/resources/missing-avatar.png';
import addDriver from '../../src/assets/resources/add-driver.png';
import type { Resource } from '../../src/typesAndValidators';
import {
    DEFAULT_ORIGIN_RESOURCE_TITLE,
    IN_HOUSE_ORIGIN_RESOURCE_TITLE,
    mergeResourcesWithDefaults,
} from '../../src/constants/resources';

export const resourceSrc = {
    bariPizza,
    defaultOrigin,
    register,
    thirdPartyPickup,
    unassignedDrawer,
    missingAvatar,
    addDriver,
} as const;

export const storyResources: Resource[] = mergeResourcesWithDefaults([
    { title: IN_HOUSE_ORIGIN_RESOURCE_TITLE, src: bariPizza, bucket_name: 'resources' },
    { title: DEFAULT_ORIGIN_RESOURCE_TITLE, src: defaultOrigin, bucket_name: 'resources' },
    { title: 'Register', src: register, bucket_name: 'resources' },
    { title: 'Third Party Pickup', src: thirdPartyPickup, bucket_name: 'resources' },
    { title: 'Unassigned Drawer', src: unassignedDrawer, bucket_name: 'resources' },
    { title: 'Missing Avatar', src: missingAvatar, bucket_name: 'resources' },
    { title: 'Add Driver', src: addDriver, bucket_name: 'resources' },
]);

/** Labels for Controls selects — map back to URLs via argTypes.mapping. */
export const roundImageSrcOptions = {
    'Bari Pizza': bariPizza,
    Register: register,
    'Missing Avatar': missingAvatar,
    'Unassigned Drawer': unassignedDrawer,
    'Third Party Pickup': thirdPartyPickup,
    '(empty — fallback)': '',
} as const;
