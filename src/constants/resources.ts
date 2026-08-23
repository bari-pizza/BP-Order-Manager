import { Resource } from '../typesAndValidators';

export const IN_HOUSE_ORIGIN_RESOURCE_TITLE = 'Bari Pizza';

export const REQUIRED_RESOURCES: Array<Resource & { description: string; bucket_name: string }> = [
    {
        title: IN_HOUSE_ORIGIN_RESOURCE_TITLE,
        src: null,
        bucket_name: 'resources',
        description: 'Logo for in-house Bari Pizza orders on tickets.',
    },
    {
        title: 'Register',
        src: null,
        bucket_name: 'resources',
        description: 'Icon for register drawers on the orders and manager screens.',
    },
    {
        title: 'Third Party Pickup',
        src: null,
        bucket_name: 'resources',
        description: 'Icon for DoorDash / Uber Eats / other third-party pickup drawers.',
    },
    {
        title: 'Unassigned Drawer',
        src: null,
        bucket_name: 'resources',
        description: 'Icon for unassigned tickets and empty driver slots.',
    },
    {
        title: 'Missing Avatar',
        src: null,
        bucket_name: 'resources',
        description: 'Fallback photo when an employee has not uploaded an avatar.',
    },
    {
        title: 'Add Driver',
        src: null,
        bucket_name: 'resources',
        description: 'Image on the manager “Add Driver” card.',
    },
];

export const mergeResourcesWithDefaults = (resources: Resource[]): Resource[] => {
    const byTitle = new Map(resources.map((resource) => [resource.title, resource]));

    return REQUIRED_RESOURCES.map((required) => {
        const existing = byTitle.get(required.title);
        return existing ?? { title: required.title, src: null, bucket_name: 'resources' };
    });
};
