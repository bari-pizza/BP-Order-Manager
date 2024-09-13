import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard } from '../DrawerCard';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { AddDriverCard } from '../AddDriverCard';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { DrawerSideBar } from '../DrawerSideBar';
import { ContextMenu } from '../../../components/Base/ContextMenu';
import { MotionProps } from 'framer-motion';
import { MotionWrapper } from '../../../rickcedlib/MotionWrapper';

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
    const { combinedDrawersAndDrivers } = useManagerDashboardContext();

    // TODO: add is_locked to database
    // if is_locked is true, only option is to unlock
    // if unlocked, can close the drawer or remove the driver (if no orders have been assigned)

    // TODO: probably fix ContextMenu for Drawer
    const motionProps: MotionProps = {
        whileTap: { scale: 0.95 },
    };

    return (
        <Stack
            {...stackProps}
            justifyContent={'start'}
            gap={2}
            direction="row"
            width="100%"
            height="100%"
            flexWrap={'wrap'}>
            {combinedDrawersAndDrivers.map((drawer) => {
                return (
                    <ContextMenu openOnType="right-click" key={drawer.drawer_id}>
                        <ContextMenu.Base>
                            <MotionWrapper motionProps={motionProps} motionKey={drawer.drawer_id}>
                                <DrawerCard drawer={drawer} />
                            </MotionWrapper>
                        </ContextMenu.Base>
                        <DrawerCard.contextMenu drawer={drawer} />
                    </ContextMenu>
                );
            })}
            <AddDriverCard {...addDriverCardDialogProps} />
            <DrawerSideBar />
        </Stack>
    );
};
