// import { useSuspenseQueries } from '@tanstack/react-query';
// import { getAllDrawers, getAllDrivers } from '../../supabaseQueries';
import { Stack } from '@mui/material';
import { DrawerAvatar, DrawerAvatarSkeleton } from './DrawerAvatar';
import { useBusinessDayContext } from '../../hooks/data/useContextData';

export const DrawerHeader = () => {
    const { drawers, drivers } = useBusinessDayContext();

    const combinedData = [...drawers, ...drivers];

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            height="175px"
            overflow="hidden"
            pb={1}>
            {combinedData?.map((drawer) => <DrawerAvatar key={drawer.drawer_id} drawer={drawer} />)}
        </Stack>
    );
};

export const DrawerHeaderSkeleton = () => {
    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            height="175px"
            overflow="hidden"
            pb={1}>
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
            <DrawerAvatarSkeleton />
        </Stack>
    );
};
