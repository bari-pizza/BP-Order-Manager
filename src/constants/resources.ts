import { Resource } from '../typesAndValidators';

export const REQUIRED_RESOURCES: Array<Resource & { description: string }> = [
    {
        title: 'Register',
        src: null,
        description: 'Icon for register drawers on the orders and manager screens.',
    },
    {
        title: 'Third Party Pickup',
        src: null,
        description: 'Icon for DoorDash / Uber Eats / other third-party pickup drawers.',
    },
    {
        title: 'Unassigned Drawer',
        src: null,
        description: 'Icon for unassigned tickets and empty driver slots.',
    },
    {
        title: 'Missing Avatar',
        src: null,
        description: 'Fallback photo when an employee has not uploaded an avatar.',
    },
    {
        title: 'Add Driver',
        src: null,
        description: 'Image on the manager “Add Driver” card.',
    },
];

export const mergeResourcesWithDefaults = (resources: Resource[]): Resource[] => {
    const byTitle = new Map(resources.map((resource) => [resource.title, resource]));

    return REQUIRED_RESOURCES.map((required) => {
        const existing = byTitle.get(required.title);
        return existing ?? { title: required.title, src: null };
    });
};
