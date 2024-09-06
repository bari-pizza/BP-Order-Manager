import { createElement } from 'react';
import { deepmerge } from '@mui/utils';
import {
    Avatar,
    AvatarProps,
    // Badge,
    BadgeProps,
    Button,
    ButtonProps,
    Skeleton,
    Stack,
    StackProps,
    SvgIconProps,
    SvgIconTypeMap,
    Typography,
    TypographyProps,
} from '@mui/material';
import type { Drawer, Driver_Drawer } from '../../typesAndValidators';
import {
    PointOfSale as PointOfSaleIcon,
    DeliveryDining as DeliveryDiningIcon,
    Face as FaceIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
// import styles from './DrawerCardBase.module.css';
import { AnimatedBadge } from '../../rickcedlib/AnimatedBadge';
import { usePrevious } from '@uidotdev/usehooks';

export interface DrawerCardSlotProps {
    button?: Partial<ButtonProps>;
    buttonStack?: Partial<StackProps>;
    badge?: Partial<BadgeProps>;
    avatar?: Partial<AvatarProps>;
    avatarIcon?: Partial<SvgIconProps>;
    nameStack?: Partial<StackProps>;
    nameTypography?: Partial<TypographyProps>;
}

interface DrawerCardBaseProps {
    drawer: Drawer | Driver_Drawer;
    drawerRef?: React.RefObject<HTMLDivElement>;
    isOpen?: boolean;
    badgeCount: number;
    handleClick?: () => void;
    sx?: {
        avatar?: React.CSSProperties;
        badge?: React.CSSProperties;
        avatarIcon?: React.CSSProperties;
        button?: React.CSSProperties;
    };
    props?: DrawerCardSlotProps;
}

export const DrawerCardBase = ({
    drawer,
    drawerRef,
    isOpen,
    badgeCount,
    handleClick,
    sx,
    props,
}: DrawerCardBaseProps) => {
    const theme = useTheme();
    const previousBadgeCount = usePrevious(badgeCount as number);

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
            height: '175px',
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
        buttonStack: {
            height: '100%',
            // width: '80px',
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

    const avatarChild = createElement(iconMap[drawer.drawer_type], {
        sx: overrideSX.avatarIcon,
        ...props?.avatarIcon,
    });

    let drawerName = drawer.name;

    if ('driver' in drawer) {
        drawerName = drawer.driver.first_name + ' ' + drawer.driver.last_name;
    }

    return (
        <Button
            className={isOpen ? 'open-drawer' : ''}
            onClick={handleClick}
            variant="outlined"
            color="primary"
            sx={overrideSX.button}
            {...props?.button}>
            <Stack
                direction="column"
                sx={overrideSX.buttonStack}
                alignItems="center"
                gap={1}
                justifyContent="space-between"
                {...props?.buttonStack}>
                <AnimatedBadge
                    // classes={{ badge: styles['badge-animation'] }}
                    // badgeContent={badgeCount}
                    badgeCount={{ start: previousBadgeCount, end: badgeCount }}
                    sx={overrideSX.badge}
                    overlap="circular"
                    {...props?.badge}
                    key={badgeCount}>
                    <Avatar
                        className={'drawer-avatar-' + drawer.drawer_id}
                        ref={drawerRef}
                        sx={overrideSX.avatar}
                        src={drawer.drawer_type === 'driver' ? 'https://mui.com/static/images/avatar/2.jpg' : ''}
                        {...props?.avatar}>
                        {avatarChild}
                    </Avatar>
                </AnimatedBadge>
                <Stack justifyContent="center" alignItems="center" height="100%" {...props?.nameStack}>
                    <Typography pt={1} variant="body2" {...props?.nameTypography}>
                        {drawerName}
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
