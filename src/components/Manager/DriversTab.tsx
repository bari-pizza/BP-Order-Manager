import { Stack, StackOwnProps } from '@mui/material';
import { DriverCard } from './DriverCard';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { AddDriverCard } from './AddDriverCard';
import { useDialogProps } from '../../hooks/ui/useDialogProps';

/*

    TODO: ****NEXT**** add a way to remove a driver
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

export const DriversTab = () => {
    const driverCardDialogProps = useDialogProps();
    const addDriverCardDialogProps = useDialogProps();
    const { driver } = useManagerDashboardContext();
    const { todays: todaysDrivers } = driver;

    return (
        <Stack {...stackProps} justifyContent={'start'} gap={2} direction="row" width="100%">
            {todaysDrivers.map((driver) => (
                <DriverCard key={driver.drawer_id} driver={driver} {...driverCardDialogProps} />
            ))}
            <AddDriverCard {...addDriverCardDialogProps} />
        </Stack>
    );
};
