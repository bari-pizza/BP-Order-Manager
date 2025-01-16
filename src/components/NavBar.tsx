import { Toolbar, Drawer, List, ListItemButton, ListItemText, ListItem, ListItemIcon, Badge } from '@mui/material';
import { useBusinessDatePicker } from './BusinessDatePicker/useBusinessDatePicker';
import { useBusinessDate } from '../hooks/data/useBusinessDate';
import { UserAvatar } from './Base/UserAvatar';
import { useLayoutContext, useUserContext } from '../hooks/data/useContextData';
import { SmartLink } from './SmartNavigate';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

import {
    AdminShieldLottieIcon,
    HomeLottieIcon,
    MarketPlaceLottieIcon,
    SearchLottieIcon,
    StaffLottieIcon,
    TimeLottieIcon,
    UserProfileLottieIcon,
} from '../rickcedlib/LottieIcons';
import { Phone as PhoneIcon, Computer as ComputerIcon } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { Order_Payment } from '../typesAndValidators';

interface NavBarItem {
    path?: string;
    icon: JSX.Element;
    text: string;
    forMobile: boolean;
    className?: string;
    onClick?: () => void;
}

const today = dayjs();

export function NavBar() {
    const { session, profile } = useUserContext();
    const { isMobile } = useLayoutContext();
    const [businessDate] = useBusinessDate();
    const { businessDatePicker, showBusinessDatePicker } = useBusinessDatePicker();
    const location = useLocation();
    const version = import.meta.env.VITE_REACT_APP_VERSION || process.env.VITE_REACT_APP_VERSIONS;

    const queryClient = useQueryClient();
    const orders = (
        profile ? (queryClient.getQueryData(['orders', businessDate.format('YYYY-MM-DD')]) ?? []) : []
    ) as Order_Payment[];
    const orderCount = (isMobile ? orders.filter((o) => o.drawer_id === profile?.id) : orders).length;

    const todaysDate = dayjs().format('YYYY-MM-DD');

    const drawerWidth = isMobile ? 65 : 200;

    const userListItem: NavBarItem = session
        ? { path: '/myaccount', icon: <UserAvatar />, text: 'Profile', forMobile: true }
        : { path: '/login', icon: <UserProfileLottieIcon />, text: 'Login', forMobile: true };

    const listItems: NavBarItem[] = [
        {
            path: '/',
            icon: <HomeLottieIcon />,
            text: 'Home',
            forMobile: true,
        },
        {
            text: today.isSame(businessDate, 'day') ? 'Today' : businessDate.format('MM/DD/YYYY'),
            icon: <TimeLottieIcon />,
            onClick: showBusinessDatePicker,
            forMobile: true,
            className: 'date-picker-button',
        },
        { path: '/search', icon: <SearchLottieIcon />, text: 'Search', forMobile: false },
        profile?.is_admin && {
            path: '/admin',
            icon: <AdminShieldLottieIcon />,
            text: 'Admin',
            forMobile: false,
        },
        profile?.is_manager && { path: '/manager', icon: <StaffLottieIcon />, text: 'Manager', forMobile: false },
        {
            path: '/orders',
            icon: (
                <Badge badgeContent={orderCount} color="primary">
                    <MarketPlaceLottieIcon />
                </Badge>
            ),
            text: 'Orders',
            forMobile: true,
        },
        userListItem,
    ].filter((item) => item && (!isMobile || item.forMobile)) as NavBarItem[];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                overflow: 'clip',
                flexShrink: 0,
                alignItems: isMobile ? 'center' : 'flex-start',
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left">
            <Toolbar />
            <List
                className={isMobile ? 'mobile-nav' : 'desktop-nav'}
                sx={{
                    height: '100%',
                    '&.mobile-nav .MuiListItem-root': {
                        paddingX: 0,
                        '& .MuiListItemIcon-root': {
                            width: '100%',
                            justifyContent: 'center',
                        },
                        '& .MuiListItemButton-root': {
                            padding: 0,
                        },
                    },
                }}>
                {listItems.map((item) => (
                    <ListItem
                        className={`lottie-icon-container ${item.className || ''}`}
                        {...(item.path
                            ? {
                                  component: SmartLink,
                                  to: item.path,
                                  keepSearchParams: true,
                              }
                            : { component: 'div' })}
                        key={item.text}>
                        <ListItemButton selected={location.pathname === item.path} onClick={item.onClick}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {!isMobile && (
                                <ListItemText primary={item.text} primaryTypographyProps={{ color: 'primary' }} />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
                {/* TODO: replace with Lottice Icon */}
                <ListItem className="lottie-icon-container" key={isMobile ? 'phone' : 'computer'} component="div">
                    <ListItemIcon>{isMobile ? <PhoneIcon /> : <ComputerIcon />}</ListItemIcon>
                    {!isMobile && <ListItemText primary={isMobile ? 'Mobile' : 'Desktop'} />}
                </ListItem>
                <ListItem sx={{ position: 'absolute', bottom: 10, textAlign: 'center' }}>
                    <ListItemText>{version}</ListItemText>
                    <ListItemText>{todaysDate}</ListItemText>
                </ListItem>
            </List>

            {businessDatePicker}
        </Drawer>
    );
}
