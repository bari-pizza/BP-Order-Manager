import { createElement } from 'react';
import { deepmerge } from '@mui/utils';
import { Avatar, Badge, Button, Skeleton, Stack, SvgIconTypeMap, Typography } from '@mui/material';
import type { Drawer, DriverDrawer } from '../../typesAndValidators';
import {
    PointOfSale as PointOfSaleIcon,
    DeliveryDining as DeliveryDiningIcon,
    Face as FaceIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface DrawerCardBaseProps {
    drawer: Drawer | DriverDrawer;
    drawerRef?: React.RefObject<HTMLDivElement>;
    isOpen?: boolean;
    badgeCount?: number;
    handleClick?: () => void;
    sx?: {
        avatar?: React.CSSProperties;
        badge?: React.CSSProperties;
        avatarIcon?: React.CSSProperties;
        button?: React.CSSProperties;
    };
}

export const DrawerCardBase = ({ drawer, drawerRef, isOpen, badgeCount, handleClick, sx }: DrawerCardBaseProps) => {
    const theme = useTheme();

    const baseSX = {
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
        text: {},
    };

    const overrideSX = deepmerge(baseSX, sx);

    const iconMap: Record<string, OverridableComponent<SvgIconTypeMap>> = {
        register: PointOfSaleIcon,
        third_party: DeliveryDiningIcon,
        driver: FaceIcon,
        unassigned: FaceIcon,
    };

    const avatarChild = createElement(iconMap[drawer.drawer_type], { sx: overrideSX.avatarIcon });

    return (
        <Button
            className={isOpen ? 'open-drawer' : ''}
            onClick={handleClick}
            variant="outlined"
            color="primary"
            sx={overrideSX.button}>
            <Stack
                direction="column"
                sx={{ height: '100%', width: '80px' }}
                alignItems="center"
                gap={1}
                justifyContent="space-between">
                <Badge badgeContent={badgeCount} sx={overrideSX.badge} overlap="circular">
                    <Avatar
                        className={'drawer-avatar-' + drawer.drawer_id}
                        ref={drawerRef}
                        sx={overrideSX.avatar}
                        src={drawer.drawer_type === 'driver' ? 'https://mui.com/static/images/avatar/2.jpg' : ''}>
                        {avatarChild}
                    </Avatar>
                </Badge>
                <Stack justifyContent="center" alignItems="center" height="100%">
                    <Typography pt={1} variant="body2">
                        {drawer.name}
                    </Typography>
                </Stack>
            </Stack>
        </Button>
    );
};

export const DrawerCardBaseSkeleton = () => {
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
