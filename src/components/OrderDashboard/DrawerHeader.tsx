// import { useSuspenseQueries } from '@tanstack/react-query';
// import { getAllDrawers, getAllDrivers } from '../../supabaseQueries';
import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard, DrawerAvatarSkeleton, UnassignedDrawerAvatar } from './DrawerCard';
import { useBariPizzaContext, useOrderDashboardContext } from '../../hooks/data/useContextData';
import { ContextMenu } from '../Base/ContextMenu';
// import { useNavigateToManagerDashboard } from '../../hooks/navigation';
import { DriverDrawer } from '../../typesAndValidators';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';

const stackProps: Partial<StackOwnProps> = {
    direction: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: '175px',
    height: '175px',
    overflow: 'hidden',
    pb: 1,
};

export const DrawerHeader = () => {
    const { drivers } = useOrderDashboardContext();
    const { drawers } = useBariPizzaContext();
    // const navigateToManagerDashboard = useNavigateToManagerDashboard();
    const { setValue: setTabName } = useLocalStorage<'managerDashboardTabName'>('managerDashboardTabName');
    const { setValue: setDriver } = useLocalStorage<'openDrawer'>('openDrawer');
    const navigate = useNavigate();
    const navigateToManagerDashboard = (driver: DriverDrawer) => {
        setTabName('drivers');
        setDriver(driver);
        navigate('/manager');
    };

    const combinedData = [...drawers, ...drivers.todays];

    return (
        <Stack {...stackProps}>
            <UnassignedDrawerAvatar />
            {combinedData?.map((drawer) => {
                if ('driver' in drawer) {
                    return (
                        <ContextMenu openOnType="right-click">
                            <ContextMenu.Base>
                                <DrawerCard key={drawer.drawer_id} drawer={drawer} />
                            </ContextMenu.Base>
                            <ContextMenu.Menu>
                                <ContextMenu.MenuItem
                                    //onClick={() => navigateToManagerDashboard({ tab: 'drivers', driver: drawer })}
                                    onClick={() => navigateToManagerDashboard(drawer as DriverDrawer)}>
                                    Driver Details
                                </ContextMenu.MenuItem>
                            </ContextMenu.Menu>
                        </ContextMenu>
                    );
                }

                return <DrawerCard key={drawer.drawer_id} drawer={drawer} />;
            })}
        </Stack>
    );
};

export const DrawerHeaderSkeleton = () => {
    return (
        <Stack {...stackProps}>
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
        </Stack>
    );
};
