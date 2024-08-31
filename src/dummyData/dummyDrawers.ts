import { faker } from '@faker-js/faker/locale/en_US';
import type { Drawer, DriverDrawer } from '../typesAndValidators';

const drawers: Drawer[] = [
    {
        drawer_id: 'feb2fc5d-19bd-42ab-b16e-38f12c86ce6a',
        created_at: '2024-08-13T01:45:22.015413+00:00',
        name: 'Drawer 1',
        drawer_type: 'register',
    },
    {
        drawer_id: '4590a732-d422-4413-aa33-9539f7f45f54',
        created_at: '2024-08-13T01:45:33.864466+00:00',
        name: 'Drawer 2',
        drawer_type: 'register',
    },
    {
        drawer_id: 'da9cc0c9-5e1e-4c25-adcf-190286ebf560',
        created_at: '2024-08-13T01:45:49.369411+00:00',
        name: 'Third Party Pickup',
        drawer_type: 'third_party',
    },
];

const createDummyDriver: () => DriverDrawer = () => {
    const fullName = faker.person.fullName();
    return {
        name: fullName,
        drawer_id: faker.string.uuid(),
        created_at: faker.date.recent().toISOString(),
        drawer_type: 'driver',
        driver: {
            id: faker.string.uuid(),
            email: null,
            phone: null,
            last_name: fullName.split(' ')[1],
            first_name: fullName.split(' ')[0],
            is_admin: false,
            is_manager: false,
            avatar_src: null,
        },
    };
};

const dummyDrivers = Array.from({ length: 10 }).map(createDummyDriver);

export default {
    drawers,
    drivers: dummyDrivers,
};
