import { Card, Stack, Typography } from '@mui/material';
import { DriverDrawer } from '../../typesAndValidators';

/* TODO: create BusinessDay.Drivers table

   TODO: Add a way to choose drivers for the day
   TODO: business_day, driver_id, is_locked

   TODO: add is_locked to Order and Payment tables
*/

export const DriversTab = () => {
    const allDrivers: DriverDrawer[] = [
        {
            drawer_id: '1',
            drawer_type: 'driver',
            name: 'John Doe',
            created_at: '2024-08-27T00:00:00.000Z',
            driver: {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
                phone: '555-555-5555',
                email: 'vI8Pb@example.com',
                is_admin: false,
                is_manager: false,
            },
        },
        {
            drawer_id: '2',
            drawer_type: 'driver',
            name: 'Jane Doe',
            created_at: '2024-08-27T00:00:00.000Z',
            driver: {
                id: '2',
                first_name: 'Jane',
                last_name: 'Doe',
                phone: '555-555-5555',
                email: 'vI8Pb@example.com',
                is_admin: false,
                is_manager: false,
            },
        },
    ];
    const cardProps = {
        sx: {
            width: '200px',
            height: '200px',
            margin: '10px',
        },
    };
    const todaysDrivers: DriverDrawer[] = [allDrivers[0]];
    return (
        <Stack direction="row">
            {todaysDrivers.map((driver) => (
                <Card key={driver.drawer_id} {...cardProps}>
                    <Stack direction="column">
                        <Typography>{driver.name}</Typography>
                    </Stack>
                </Card>
            ))}
            <Card {...cardProps}>
                <Stack direction="column">
                    <Typography>Add Driver</Typography>
                </Stack>
            </Card>
        </Stack>
    );
};
