import { Stack, StackOwnProps } from '@mui/material';
import { DriverDrawer } from '../../typesAndValidators';
import { DrawerCardBase } from '../Base/DrawerCardBase';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';

/*

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
            avatar_src: null,
        },
    };

    return <DrawerCardBase drawer={dummyDrawer} handleClick={handleClick} />;
};

export const DriversTab = () => {
    const {
        driver: { todays: todaysDrivers },
    } = useManagerDashboardContext();
    const handleDriverClick = (driver: DriverDrawer) => {
        console.log('clicked driver', driver);
    };
    const handleAddDriverClick = () => {
        console.log('clicked add driver');
    };

    return (
        <Stack {...stackProps} justifyContent={'start'} gap={2} direction="row" width="100%">
            {todaysDrivers.map((driver) => (
                <DrawerCardBase key={driver.drawer_id} drawer={driver} handleClick={() => handleDriverClick(driver)} />
            ))}
            <AddDriverCard handleClick={handleAddDriverClick} />
        </Stack>
    );
};
