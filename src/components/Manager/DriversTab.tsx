import { Stack, StackOwnProps } from '@mui/material';
import { DriverCard } from './DriverCard';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { AddDriverCard } from './AddDriverCard';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { DriverSideBar } from './DriverSideBar';

/*
   TODO: business_day, driver_id, is_locked

   TODO: add is_locked to Order and Payment tables
*/

const stackProps: Partial<StackOwnProps> = {
    direction: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '300px',
    height: '300px',
    overflow: 'hidden',
    pb: 1,
};

export const DriversTab = () => {
    const addDriverCardDialogProps = useDialogProps();
    const { drivers } = useManagerDashboardContext();
    const { todays: todaysDrivers } = drivers;
    // TODO: add is_locked to database
    // if is_locked is true, only option is to unlock
    // if unlocked, can close the drawer or remove the driver (if no orders have been assigned)

    return (
        <Stack {...stackProps} justifyContent={'start'} gap={2} direction="row" width="100%">
            {todaysDrivers.map((driver) => (
                <DriverCard key={driver.drawer_id} driver={driver} />
            ))}
            <AddDriverCard {...addDriverCardDialogProps} />
            <DriverSideBar />
        </Stack>
        // TODO: ***NEXT*** Add a way to create a brand new driver
    );
};
