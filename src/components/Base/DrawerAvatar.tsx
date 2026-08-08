import {
    // Avatar,
    Badge,
    Skeleton,
    // SvgIconTypeMap
} from '@mui/material';
import { Drawer, DrawerType, Driver_Drawer } from '../../typesAndValidators';
import {
    DrawerCardOverrideSX,
    // DrawerCardSlotProps
} from './DrawerCardBase';
// import { createElement } from 'react';
import { useTheme } from '@mui/material/styles';
import { LockLottieIcon, RoundLottieIcon } from '../../rickcedlib/LottieIcons';
import { useBariPizzaContext } from '../../hooks/data/useContextData';

type DrawerAvatarProps = {
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    variant?: 'standard' | 'border';
    sx?: DrawerCardOverrideSX;
    drawer?: Drawer | Driver_Drawer;
    playOnce?: boolean;
    // props?: DrawerCardSlotProps;
    // drawerRef?: React.RefObject<HTMLDivElement>;
    isLocked?: boolean;
};

const unassignedDrawer: Drawer = {
    drawer_id: 'unassigned',
    name: 'Unassigned',
    created_at: '2024-08-27T00:00:00.000Z',
    drawer_type: 'unassigned',
    is_deleted: false,
};

const smallStyle = {
    height: '24px',
    width: '24px',
    border: '1px solid',
};

const mediumStyle = {
    height: '35px',
    width: '35px',
    border: '2px solid',
};

const largeStyle = {
    height: '80px',
    width: '80px',
    border: '4px solid',
};

const xlargeStyle = {
    height: '125px',
    width: '125px',
    border: '4px solid',
};

export const DrawerAvatar = ({
    drawer = unassignedDrawer,
    size = 'medium',
    variant = 'standard',
    sx,
    playOnce = false,
    // props,
    // drawerRef,
    isLocked = false,
}: DrawerAvatarProps) => {
    const theme = useTheme();
    const { resources } = useBariPizzaContext();
    // const iconMap: Record<string, OverridableComponent<SvgIconTypeMap>> = {
    //     register: PointOfSaleIcon,
    //     third_party: DeliveryDiningIcon,
    //     driver: FaceIcon,
    //     unassigned: FaceIcon,
    // };

    const keys: Record<DrawerType, string> = {
        register: 'Register',
        third_party: 'Third Party Pickup',
        driver: 'Unassigned Drawer',
        unassigned: 'Unassigned Drawer',
    };

    const resource = resources.find((resource) => resource.title === keys[drawer.drawer_type]);
    const missingAvatarSrc = resources.find((resource) => resource.title === 'Missing Avatar')?.src;

    const imageSrc = ('driver' in drawer && (drawer.driver.avatar_src || missingAvatarSrc)) || resource?.src || '';

    const finalAvatarSx = {
        ...(size === 'small' ? smallStyle : {}),
        ...(size === 'medium' ? mediumStyle : {}),
        ...(size === 'large' ? largeStyle : {}),
        ...(size === 'xlarge' ? xlargeStyle : {}),
        ...(variant === 'border' ? {} : { border: 'none' }),
        borderColor: theme.palette.primary.main,
        ...sx?.avatar,
    };

    // const avatarChild = createElement(iconMap[drawer.drawer_type], {
    //     sx: sx?.avatarIcon,
    //     ...props?.avatarIcon,
    // });
    return (
        <Badge
            badgeContent={isLocked ? <LockLottieIcon /> : 0}
            sx={{
                '& .MuiBadge-badge': {
                    background: 'transparent',
                    boxShadow: 'none',
                    color: 'black',
                },
                '& .MuiBadge-badge svg': {
                    fontSize: '3em',
                },
            }}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <RoundLottieIcon
                imageSrc={imageSrc}
                height={finalAvatarSx.height as string}
                width={finalAvatarSx.width as string}
                className={'drawer-avatar-' + drawer.drawer_id}
                playOnce={playOnce}
            />
            {/* <Avatar
                className={'drawer-avatar-' + drawer.drawer_id}
                ref={drawerRef}
                sx={finalAvatarSx}
                src={('driver' in drawer && drawer.driver.avatar_src) || ''}
                {...props?.avatar}>
                {avatarChild}
            </Avatar> */}
        </Badge>
    );
};

export const DrawerAvatarSkeleton = ({
    size = 'medium',
    variant = 'standard',
}: Omit<DrawerAvatarProps, 'drawer' | 'drawerRef' | 'props' | 'sx'>) => {
    const theme = useTheme();

    const finalAvatarSx = {
        ...(size === 'small' ? smallStyle : {}),
        ...(size === 'medium' ? mediumStyle : {}),
        ...(size === 'large' ? largeStyle : {}),
        ...(size === 'xlarge' ? xlargeStyle : {}),
        ...(variant === 'border' ? {} : { border: 'none' }),
        borderColor: theme.palette.primary.main,
    };
    return <Skeleton sx={finalAvatarSx} variant="circular" />;
};
