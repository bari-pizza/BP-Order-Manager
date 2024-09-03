import {
    Toolbar,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItem,
    ListItemIcon,
    SvgIconTypeMap,
} from '@mui/material';
import {
    Search,
    Home as HomeIcon,
    Key as AdminIcon,
    LocalPizza as LocalPizzaIcon,
    ManageAccounts as ManagerIcon,
} from '@mui/icons-material';
import { useBusinessDatePicker } from './BusinessDatePicker/useBusinessDatePicker';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useBusinessDate } from '../hooks/data/useBusinessDate';
import { UserAvatar } from './Base/UserAvatar';
import { useUserContext } from '../hooks/data/useContextData';
import { SmartLink } from './SmartNavigate';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const drawerWidth = 200;

interface NavBarItem {
    path?: string;
    icon: JSX.Element;
    text: string;
    onClick?: () => void;
}
// TODO: Handle order deletion

const today = dayjs();

const iconProps: SvgIconTypeMap['props'] = { color: 'primary', sx: { fontSize: '35px' } };

export function NavBar() {
    const { session, profile } = useUserContext();
    const [businessDate] = useBusinessDate();
    const { businessDatePicker, showBusinessDatePicker } = useBusinessDatePicker();
    const location = useLocation();

    const userListItem: NavBarItem = session
        ? { path: '/myaccount', icon: <UserAvatar />, text: 'Profile' }
        : { path: '/login', icon: <UserAvatar />, text: 'Login' };

    const listItems: NavBarItem[] = [
        { path: '/', icon: <HomeIcon {...iconProps} />, text: 'Home' },
        {
            text: today.isSame(businessDate, 'day') ? 'Today' : businessDate.format('MM/DD/YYYY'),
            icon: <CalendarIcon {...iconProps} />,
            onClick: showBusinessDatePicker,
        },
        { path: '/search', icon: <Search {...iconProps} />, text: 'Search' },
        profile?.is_admin && { path: '/admin', icon: <AdminIcon {...iconProps} />, text: 'Admin' },
        profile?.is_manager && { path: '/manager', icon: <ManagerIcon {...iconProps} />, text: 'Manager' },
        { path: '/orders', icon: <LocalPizzaIcon {...iconProps} />, text: 'Orders' },
        userListItem,
    ].filter(Boolean) as NavBarItem[];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left">
            <Toolbar />
            <List>
                {listItems.map((item) => (
                    <ListItem
                        {...(item.path
                            ? {
                                  component: SmartLink,
                                  to: item.path,
                                  keepSearchParams: true,
                                  unstable_viewTransition: true,
                              }
                            : { component: 'div' })}
                        key={item.text}>
                        <ListItemButton selected={location.pathname === item.path} onClick={item.onClick}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ color: 'primary' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {businessDatePicker}
        </Drawer>
    );
}
