import { useContext } from 'react';
import { Avatar, Button, Skeleton, Stack, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../supabaseQueries';
import { getDrawerFullName } from '../../utils';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';

interface DrawerAvatarProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
    const { setOpenDrawer } = useContext(OrderDashboardContext);
    const fullName = getDrawerFullName(drawer);
    return (
        // large circle with image and name of drawer
        <Button onClick={() => setOpenDrawer(drawer)}>
            <Stack direction="column" sx={{ height: '100%', width: 'min-content' }} alignItems="center">
                <Avatar sx={{ height: '4em', width: '4em' }}>{fullName}</Avatar>
                <Typography>{fullName}</Typography>
            </Stack>
        </Button>
    );
};

export const DrawerAvatarSkeleton = () => {
    return (
        <Button>
            <Stack direction="column" sx={{ height: '100%', width: 'min-content' }} alignItems="center">
                <Skeleton variant="circular">
                    <Avatar sx={{ height: '4em', width: '4em' }}>Full Name Here</Avatar>
                </Skeleton>
                <Skeleton variant="text">
                    <Typography>Full Name Here</Typography>
                </Skeleton>
            </Stack>
        </Button>
    );
};
