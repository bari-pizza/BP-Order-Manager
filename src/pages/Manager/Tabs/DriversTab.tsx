import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard } from '../DrawerCard';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { AddDriverCard } from '../AddDriverCard';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { DrawerSideBar } from '../DrawerSideBar';
import { ContextMenu } from '../../../components/Base/ContextMenu';

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

export const DrawersTab = () => {
    const addDriverCardDialogProps = useDialogProps();
    const { drivers, drawers } = useManagerDashboardContext();
    const { todays: todaysDrivers } = drivers;
    // TODO: add is_locked to database
    // if is_locked is true, only option is to unlock
    // if unlocked, can close the drawer or remove the driver (if no orders have been assigned)

    // TODO: probably fix ContextMenu for Drawer
    return (
        <Stack
            {...stackProps}
            justifyContent={'start'}
            gap={2}
            direction="row"
            width="100%"
            height="100%"
            flexWrap={'wrap'}>
            {drawers.all.map((drawer) => (
                <ContextMenu openOnType="right-click" key={drawer.drawer_id}>
                    <ContextMenu.Base>
                        <DrawerCard key={drawer.drawer_id} drawer={drawer} />
                    </ContextMenu.Base>
                    <DrawerCard.contextMenu drawer={drawer} />
                </ContextMenu>
            ))}
            {todaysDrivers.map((driver) => (
                <ContextMenu openOnType="right-click" key={driver.drawer_id}>
                    <ContextMenu.Base>
                        <DrawerCard key={driver.drawer_id} drawer={driver} />
                    </ContextMenu.Base>
                    <DrawerCard.contextMenu drawer={driver} />
                </ContextMenu>
            ))}
            <AddDriverCard {...addDriverCardDialogProps} />
            <DrawerSideBar />
        </Stack>
    );
};
