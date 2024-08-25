import { Avatar, Button, Skeleton, Stack, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../dataHooks/useContextData';

interface DrawerAvatarProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
    const { openDrawer, handleDrawerClick } = useOrderDashboardContext();
    const fullName = getDrawerFullName(drawer);

    const isOpen = openDrawer?.drawer_id === drawer?.drawer_id;

    return (
        // large circle with image and name of drawer
        <Button onClick={() => handleDrawerClick(drawer)} variant={isOpen ? 'contained' : 'text'}>
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
