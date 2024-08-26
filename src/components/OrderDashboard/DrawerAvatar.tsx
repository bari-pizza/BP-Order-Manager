import { Avatar, Button, Skeleton, Stack, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';

interface DrawerAvatarProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
    const { drawer: ctxDrawer, orders } = useOrderDashboardContext();
    const fullName = getDrawerFullName(drawer);

    const isOpen = ctxDrawer.current?.drawer_id === drawer?.drawer_id;

    const orderCount = orders.byDrawerID(drawer.drawer_id).length;

    return (
        <Button onClick={() => ctxDrawer.onClick(drawer)} variant={isOpen ? 'contained' : 'text'}>
            <Stack direction="column" sx={{ height: '100%', width: 'min-content' }} alignItems="center">
                <Avatar sx={{ height: '4em', width: '4em' }}>{fullName}</Avatar>
                <Typography>{fullName}</Typography>
                <Typography>{orderCount} Orders</Typography>
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
