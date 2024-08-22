// import { useSuspenseQueries } from '@tanstack/react-query';
// import { getAllDrawers, getAllDrivers } from '../../supabaseQueries';
import { Stack } from '@mui/material';
import { DrawerAvatar, DrawerAvatarSkeleton } from './DrawerAvatar';
import { useBusinessDayContext } from '../../dataHooks/useContextData';

export const DrawerHeader = () => {
    const { drawers, drivers } = useBusinessDayContext();

    const combinedData = [...drawers, ...drivers];

    return (
        <Stack direction="row" justifyContent="space-around" sx={{ height: 175, flex: 'none', overflow: 'hidden' }}>
            {combinedData?.map((drawer) => <DrawerAvatar key={drawer.drawer_id} drawer={drawer} />)}
        </Stack>
    );
};

export const DrawerHeaderSkeleton = () => {
    return (
        <Stack direction="row" justifyContent="space-around" sx={{ height: 175, overflow: 'hidden' }}>
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
        </Stack>
    );
};
