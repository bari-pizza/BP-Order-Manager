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
    DesktopLottieIcon,
    HelpLottieIcon,
    HomeLottieIcon,
    ManagerLottieIcon,
    PizzaLottieIcon,
    MobileLottieIcon,
    SearchLottieIcon,
    TimeLottieIcon,
    UserProfileLottieIcon,
} from '../rickcedlib/LottieIcons';
import { useQueryClient } from '@tanstack/react-query';
import { Order_Payment } from '../typesAndValidators';
import { useClearCache } from '../rickcedlib/hooks/useClearCache';
// @ts-expect-error remove if module declaration can be fixed
import { m } from '../paraglide/messages.js';
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
    const clearCacheAndReload = useClearCache();
    const { session, profile } = useUserContext();
    const { isMobile } = useLayoutContext();
    const [businessDate] = useBusinessDate();
    const { businessDatePicker, showBusinessDatePicker } = useBusinessDatePicker();
    const location = useLocation();
    const version = `__APP_VERSION__`.replace(/"/g, '');

    const queryClient = useQueryClient();
    const orders = (
        profile ? queryClient.getQueryData(['orders', businessDate.format('YYYY-MM-DD')]) ?? [] : []
    ) as Order_Payment[];
    const orderCount = (isMobile ? orders.filter((o) => o.drawer_id === profile?.id) : orders).length;

    const todaysDate = dayjs().format('ddd MMM D, YYYY');

    const drawerWidth = isMobile ? 65 : 200;

    const userListItem: NavBarItem = session
        ? { path: '/myaccount', icon: <UserAvatar />, text: m.profile(), forMobile: true }
        : { path: '/login', icon: <UserProfileLottieIcon />, text: m.login(), forMobile: true };

    const listItems: NavBarItem[] = [
        {
            path: '/',
            icon: <HomeLottieIcon />,
            text: m.home(),
            forMobile: true,
        },
        {
            text: today.isSame(businessDate, 'day') ? m.today() : businessDate.format('MM/DD/YYYY'),
            icon: <TimeLottieIcon />,
            onClick: showBusinessDatePicker,
            forMobile: true,
            className: 'date-picker-button',
        },
        { path: '/search', icon: <SearchLottieIcon />, text: m.search(), forMobile: false },
        profile?.is_admin && {
            path: '/admin',
            icon: <AdminShieldLottieIcon />,
            text: m.admin(),
            forMobile: false,
        },
        profile?.is_manager && {
            path: '/manager',
            icon: <ManagerLottieIcon />,
            text: m.manager(),
            forMobile: false,
        },
        {
            path: '/orders',
            icon: (
                <Badge badgeContent={orderCount} color="primary">
                    <PizzaLottieIcon />
                </Badge>
            ),
            text: m.orders(),
            forMobile: true,
        },
        {
            path: '/how-to',
            icon: <HelpLottieIcon />,
            text: m.howTo(),
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
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ color: 'primary', textTransform: 'capitalize' }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
                {/* TODO: replace with Lottice Icon */}
                <ListItem
                    sx={{ position: 'absolute', bottom: 10, textAlign: 'center' }}
                    className="lottie-icon-container">
                    <List>
                        <ListItemButton onClick={clearCacheAndReload}>
                            <ListItem id="bpom-version">
                                <ListItemIcon sx={{ justifyContent: 'center' }}>
                                    {isMobile ? <MobileLottieIcon /> : <DesktopLottieIcon />}
                                </ListItemIcon>
                                <ListItemText>{version}</ListItemText>
                            </ListItem>
                        </ListItemButton>
                        <ListItemText style={{ textTransform: 'capitalize' }}>{todaysDate}</ListItemText>
                    </List>
                </ListItem>
            </List>

            {businessDatePicker}
        </Drawer>
    );
}
