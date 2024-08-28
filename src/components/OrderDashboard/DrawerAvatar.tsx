import { createElement, useRef } from 'react';
import { Avatar, Badge, Button, Skeleton, Stack, SvgIconTypeMap, Tooltip, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import { getDrawerFullName } from '../../utils';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import {
    PointOfSale as PointOfSaleIcon,
    DeliveryDining as DeliveryDiningIcon,
    Face as FaceIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface DrawerAvatarProps {
    drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
    const { drawer: ctxDrawer, orders, ticket } = useOrderDashboardContext();
    const fullName = getDrawerFullName(drawer);
    const isOpen = ctxDrawer.current?.drawer_id === drawer?.drawer_id;
    const orderCount = orders.byDrawerID(drawer.drawer_id).length;
    const theme = useTheme();
    const drawerRef = useRef<HTMLDivElement>(null);

    if (drawerRef.current) {
        ctxDrawer.refs[drawer.drawer_id] = drawerRef;
    }

    const sx = {
        avatar: {
            height: '4em',
            width: '4em',
            color: theme.palette.primary.main,
            bgcolor: 'white',
            border: '4px solid ' + theme.palette.primary.main,
        },
        badge: {
            '& .MuiBadge-badge': {
                bgcolor: theme.palette.secondary.main,
                color: '#fff',
                boxShadow: '1px 1px 5px black',
            },
        },
        avatarIcon: {
            height: '2em',
            width: '2em',
            '& .MuiAvatar-root': {
                backgroundColor: 'white !important',
            },
        },
        button: {
            height: '100%',
            width: '100px',
            '& .MuiTypography-root': {
                color: theme.palette.primary.main,
            },
            '&.open-drawer': {
                '& .MuiAvatar-root': {
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    borderColor: 'white',
                },
                '& .MuiTypography-root': {
                    color: 'white',
                },
                backgroundColor: theme.palette.primary.main,
            },
            '&:hover:not(.open-drawer)': {
                backgroundColor: theme.palette.primary.light,
                '& .MuiAvatar-root': {
                    borderColor: theme.palette.primary.main,
                },
            },
        },
    };

    const iconMap: Record<string, OverridableComponent<SvgIconTypeMap>> = {
        register: PointOfSaleIcon,
        third_party: DeliveryDiningIcon,
        driver: FaceIcon,
        unassigned: FaceIcon,
    };

    const avatarChild = createElement(iconMap[drawer.drawer_type], { sx: sx.avatarIcon });

    const selectedTicketsCount = ticket.count.selected;

    const tooltip =
        !isOpen && selectedTicketsCount ? (
            <Typography variant="body2">
                Add {selectedTicketsCount} tickets to {fullName}
            </Typography>
        ) : (
            ''
        );

    return (
        <Tooltip title={tooltip}>
            <Button
                className={isOpen ? 'open-drawer' : ''}
                onClick={() => ctxDrawer.onClick(drawer)}
                variant="outlined"
                color="primary"
                sx={sx.button}>
                <Stack direction="column" sx={{ height: '100%', width: '80px' }} alignItems="center">
                    <Badge badgeContent={orderCount} sx={sx.badge} overlap="circular">
                        <Avatar
                            ref={drawerRef}
                            sx={sx.avatar}
                            src={drawer.drawer_type === 'driver' ? 'https://mui.com/static/images/avatar/2.jpg' : ''}>
                            {avatarChild}
                        </Avatar>
                    </Badge>
                    <Typography pt={1} variant="body2">
                        {fullName}
                    </Typography>
                </Stack>
            </Button>
        </Tooltip>
    );
};

export const UnassignedDrawerAvatar = () => {
    const { drawer } = useOrderDashboardContext();
    return <DrawerAvatar drawer={drawer.unassigned} />;
};

export const DrawerAvatarSkeleton = () => {
    return (
        <Button variant="contained">
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
