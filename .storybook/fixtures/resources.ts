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
import doorDashLogo from '../../src/assets/DoorDash logo.png';
import pizzamicoLogo from '../../src/assets/Pizzamico logo.ico';
import type { OrderOrigin, Resource } from '../../src/typesAndValidators';
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
    doorDash: doorDashLogo,
    pizzamico: pizzamicoLogo,
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

export const storyOrigins = {
    bariPizza: {
        origin_id: 'origin-in-house',
        name: 'Bari Pizza',
        icon: bariPizza,
        is_third_party: false,
        can_deliver: true,
        can_tip: true,
        has_order_number: true,
        is_prepaid_toggleable: true,
        default_is_prepaid: false,
        is_deleted: false,
    },
    doorDash: {
        origin_id: 'origin-doordash',
        name: 'DoorDash',
        icon: doorDashLogo,
        is_third_party: true,
        can_deliver: true,
        can_tip: false,
        has_order_number: true,
        is_prepaid_toggleable: false,
        default_is_prepaid: true,
        is_deleted: false,
    },
    pizzamico: {
        origin_id: 'origin-pizzamico',
        name: 'Pizzamico',
        icon: pizzamicoLogo,
        is_third_party: true,
        can_deliver: true,
        can_tip: true,
        has_order_number: false,
        is_prepaid_toggleable: true,
        default_is_prepaid: true,
        is_deleted: false,
    },
    /** Third-party with no icon → OriginLogo falls back to Default Origin resource. */
    unknownThirdParty: {
        origin_id: 'origin-unknown',
        name: 'Uber Eats',
        icon: '',
        is_third_party: true,
        can_deliver: true,
        can_tip: false,
        has_order_number: true,
        is_prepaid_toggleable: false,
        default_is_prepaid: true,
        is_deleted: false,
    },
} as const satisfies Record<string, OrderOrigin>;

export const storyOriginsList: OrderOrigin[] = Object.values(storyOrigins);

/** Labels for Controls selects — map back to URLs via argTypes.mapping. */
export const roundImageSrcOptions = {
    'Bari Pizza': bariPizza,
    Register: register,
    'Missing Avatar': missingAvatar,
    'Unassigned Drawer': unassignedDrawer,
    'Third Party Pickup': thirdPartyPickup,
    '(empty — fallback)': '',
} as const;
