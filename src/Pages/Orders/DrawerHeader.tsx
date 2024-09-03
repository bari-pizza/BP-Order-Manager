import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard, DrawerAvatarSkeleton, UnassignedDrawerAvatar } from './DrawerCard';
import { useBariPizzaContext, useOrderDashboardContext } from '../../hooks/data/useContextData';
import { ContextMenu } from '../../components/Base/ContextMenu';
import { DriverDrawer } from '../../typesAndValidators';

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

    const combinedData = [...drawers, ...drivers.todays];

    return (
        <Stack {...stackProps}>
            <UnassignedDrawerAvatar />
            {combinedData?.map((drawer) => {
                if ('driver' in drawer) {
                    return (
                        <ContextMenu openOnType="right-click" key={drawer.drawer_id}>
                            <ContextMenu.Base>
                                <DrawerCard key={drawer.drawer_id} drawer={drawer} />
                            </ContextMenu.Base>
                            <ContextMenu.Menu>
                                <DrawerCard.driverContextMenu driver={drawer as DriverDrawer} />
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
