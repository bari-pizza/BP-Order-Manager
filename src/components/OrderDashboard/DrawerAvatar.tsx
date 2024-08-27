import { Avatar, Badge, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import {
    PointOfSale as PointOfSaleIcon,
    DeliveryDining as DeliveryDiningIcon,
    Face as FaceIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface DrawerAvatarProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
    const { drawer: ctxDrawer, orders, ticket } = useOrderDashboardContext();
    const fullName = getDrawerFullName(drawer);
    const isOpen = ctxDrawer.current?.drawer_id === drawer?.drawer_id;
    const orderCount = orders.byDrawerID(drawer.drawer_id).length;
    const theme = useTheme();

    const sx = {
        avatar: {
            height: '4em',
            width: '4em',
            bgcolor: theme.palette.secondary.main,
        },
        badge: {
            '& .MuiBadge-badge': {
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                boxShadow: '1px 1px 5px black',
            },
        },
        avatarIcon: {
            height: '2em',
            width: '2em',
        },
        button: {
            height: '100%',
            '&:hover, &.open-drawer': {
                '& .MuiAvatar-root': {
                    bgcolor: theme.palette.primary.main,
                },
                '& .MuiTypography-root': {
                    color: 'white',
                },
                '& .MuiBadge-badge': {
                    bgcolor: theme.palette.secondary.main,
                },
                backgroundColor: theme.palette.secondary.main,
            },
        },
    };

    const avatarChild =
        drawer.drawer_type === 'register' ? (
            <PointOfSaleIcon sx={sx.avatarIcon} />
        ) : drawer.drawer_type === 'third_party' ? (
            <DeliveryDiningIcon sx={sx.avatarIcon} />
        ) : (
            <FaceIcon sx={sx.avatarIcon} />
        );

    const tooltip = !isOpen && ticket.some.areSelected ? `Add tickets to ${fullName}` : '';

    // TODO: change size of avatar if hovered or openDrawer is true
    // TODO: animate the transition of the avatar

    return (
        <Tooltip title={tooltip}>
            <Button
                className={isOpen ? 'open-drawer' : ''}
                onClick={() => ctxDrawer.onClick(drawer)}
                variant={isOpen ? 'contained' : 'text'}
                color="secondary"
                sx={sx.button}>
                <Stack direction="column" sx={{ height: '100%', width: '80px' }} alignItems="center">
                    <Badge badgeContent={orderCount} sx={sx.badge} overlap="circular">
                        <Avatar sx={sx.avatar}>{avatarChild}</Avatar>
                    </Badge>
                    <Typography>{fullName}</Typography>
                </Stack>
            </Button>
        </Tooltip>
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
