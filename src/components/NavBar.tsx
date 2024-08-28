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
import { Search, Home as HomeIcon, LocalPizza as LocalPizzaIcon } from '@mui/icons-material';
import { useBusinessDatePicker } from './BusinessDatePicker/useBusinessDatePicker';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useBusinessDate } from '../hooks/data/useBusinessDate';
import { UserAvatar } from './UserAvatar';
import { useUserContext } from '../hooks/data/useContextData';
import { SmartLink } from './SmartNavigate';
import dayjs from 'dayjs';

const drawerWidth = 200;

interface NavBarItem {
    path?: string;
    icon: JSX.Element;
    text: string;
    onClick?: () => void;
}

// TODO: Add a way to choose drivers for the day
// TODO: Handle order deletion

/* TODO: create BusinessDay.Drivers table
    business_day, driver_id, is_locked

    add is_locked to Order and Payment tables
*/

const today = dayjs();

const iconProps: SvgIconTypeMap['props'] = { color: 'primary', sx: { fontSize: '35px' } };

export function NavBar() {
    const { session } = useUserContext();
    const [businessDate] = useBusinessDate();
    const { businessDatePicker, showBusinessDatePicker } = useBusinessDatePicker();

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
        { path: '/orders', icon: <LocalPizzaIcon {...iconProps} />, text: 'Orders' },
        userListItem,
    ];

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
                        <ListItemButton onClick={item.onClick}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>{item.text}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {businessDatePicker}
        </Drawer>
    );
}
