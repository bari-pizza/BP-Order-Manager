// import { useSuspenseQueries } from '@tanstack/react-query';
// import { getAllDrawers, getAllDrivers } from '../../supabaseQueries';
import { Stack, StackOwnProps } from '@mui/material';
import { DrawerCard, DrawerAvatarSkeleton, UnassignedDrawerAvatar } from './DrawerCard';
import { useBariPizzaContext } from '../../hooks/data/useContextData';

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
    const { drawers, drivers } = useBariPizzaContext();

    const combinedData = [...drawers, ...drivers];

    return (
        <Stack {...stackProps}>
            <UnassignedDrawerAvatar />
            {combinedData?.map((drawer) => <DrawerCard key={drawer.drawer_id} drawer={drawer} />)}
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
