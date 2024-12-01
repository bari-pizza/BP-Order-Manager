import { deepmerge } from '@mui/utils';
import {
    AvatarProps,
    Badge,
    BadgeProps,
    Button,
    ButtonProps,
    Skeleton,
    Stack,
    StackProps,
    SvgIconProps,
    Typography,
    TypographyProps,
} from '@mui/material';
import type { Drawer, Driver_Drawer } from '../../typesAndValidators';
import { SxProps, useTheme } from '@mui/material/styles';
import { DrawerAvatar, DrawerAvatarSkeleton } from './DrawerAvatar';

export interface DrawerCardSlotProps {
    button?: Partial<ButtonProps>;
    buttonStack?: Partial<StackProps>;
    badge?: Partial<BadgeProps>;
    avatar?: Partial<AvatarProps>;
    avatarIcon?: Partial<SvgIconProps>;
    nameStack?: Partial<StackProps>;
    nameTypography?: Partial<TypographyProps>;
}

export type DrawerCardOverrideSX = {
    avatar?: SxProps;
    badge?: SxProps;
    avatarIcon?: SxProps;
    button?: SxProps;
    buttonStack?: SxProps;
    text?: SxProps;
};

interface DrawerCardBaseProps {
    drawer: Drawer | Driver_Drawer;
    drawerRef?: React.RefObject<HTMLDivElement>;
    isOpen?: boolean;
    badgeCount: number;
    handleClick?: () => void;
    sx?: DrawerCardOverrideSX;
    props?: DrawerCardSlotProps;
    isLocked?: boolean;
}

export const DrawerCardBase = ({
    drawer,
    drawerRef,
    isOpen,
    badgeCount,
    handleClick,
    sx,
    props,
    isLocked,
}: DrawerCardBaseProps) => {
    const theme = useTheme();

    const baseSX: DrawerCardOverrideSX = {
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

    let drawerName = drawer.name;

    if ('driver' in drawer) {
        drawerName = drawer.driver.first_name + ' ' + drawer.driver.last_name;
    }

    return (
        <Button
            className={
                (isOpen ? 'open-drawer' : '') +
                ' lottie-icon-container drawer-card-button ' +
                'drawer-card-button-' +
                (drawer.drawer_id === 'add-driver' ? 'add-driver' : drawer.drawer_type)
            }
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
                <Badge
                    // badgeCount={{ start: previousBadgeCount, end: badgeCount }}
                    badgeContent={badgeCount}
                    sx={overrideSX.badge}
                    overlap="circular"
                    {...props?.badge}
                    key={badgeCount}>
                    <DrawerAvatar
                        drawer={drawer}
                        drawerRef={drawerRef}
                        sx={overrideSX}
                        props={props}
                        isLocked={isLocked}
                    />
                </Badge>
                <Stack justifyContent="center" alignItems="center" height="100%" {...props?.nameStack}>
                    <Typography pt={1} variant="body2" {...props?.nameTypography}>
                        {drawerName}
                    </Typography>
                </Stack>
            </Stack>
        </Button>
    );
};

export const DrawerCardBaseSkeleton = ({ sx, props }: { sx?: DrawerCardOverrideSX; props?: DrawerCardSlotProps }) => {
    const theme = useTheme();
    const baseSX: DrawerCardOverrideSX = {
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

    return (
        <Button variant="outlined" color="primary" sx={overrideSX.button} {...props?.button}>
            <Stack
                direction="column"
                sx={overrideSX.buttonStack}
                alignItems="center"
                gap={1}
                justifyContent="space-between"
                {...props?.buttonStack}>
                <Badge sx={overrideSX.badge} overlap="circular" {...props?.badge}>
                    <DrawerAvatarSkeleton size="xlarge" />
                </Badge>

                <Stack justifyContent="center" alignItems="center" height="100%" {...props?.nameStack}>
                    <Skeleton>
                        <Typography pt={1} variant="body2" {...props?.nameTypography}>
                            Long name would go here!
                        </Typography>
                    </Skeleton>
                </Stack>
            </Stack>
        </Button>
    );
};
