import { Stack, StackOwnProps } from '@mui/material';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';

// TODO: create a new context for todays drawers and drivers

/* TODO: create BusinessDay.Drivers table

   TODO: Add a way to choose drivers for the day
   TODO: business_day, driver_id, is_locked

   TODO: add is_locked to Order and Payment tables
*/

const stackProps: Partial<StackOwnProps> = {
    direction: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '175px',
    height: '175px',
    overflow: 'hidden',
    pb: 1,
};

const AddDriverCard = ({ handleClick }: { handleClick: () => void }) => {
    const dummyDrawer: DriverDrawer = {
        created_at: '2024-08-27T00:00:00.000Z',
        drawer_id: '3',
        drawer_type: 'driver',
        name: 'Add Driver',
        driver: {
            id: '3',
            email: 'vI8Pb@example.com',
            first_name: 'Jane',
            is_admin: false,
            is_manager: false,
            last_name: 'Doe',
            phone: '555-555-5555',
        },
    };

    return <DrawerCardBase drawer={dummyDrawer} handleClick={handleClick} />;
};

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
    const todaysDrivers: DriverDrawer[] = [allDrivers[0]];
    const handleDriverClick = (driver: DriverDrawer) => {
        console.log('clicked driver', driver);
    };
    const handleAddDriverClick = () => {
        console.log('clicked add driver');
    };

    return (
        <Stack direction="row">
            <Stack {...stackProps} justifyContent={'start'} gap={2} direction="row" width="100%">
                {todaysDrivers.map((driver) => (
                    <DrawerCardBase
                        key={driver.drawer_id}
                        drawer={driver}
                        handleClick={() => handleDriverClick(driver)}
                    />
                ))}
            </Stack>
            <Stack {...stackProps} width="120px" justifyContent="end">
                <AddDriverCard handleClick={handleAddDriverClick} />
            </Stack>
        </Stack>
    );
};
