import { Toolbar, Drawer, List, ListItemButton, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import { Search, Home as HomeIcon, LocalPizza as LocalPizzaIcon } from '@mui/icons-material';
import { useBusinessDatePicker } from './BusinessDatePicker/useBusinessDatePicker';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useBusinessDate } from '../dataHooks/useBusinessDate';
import { UserAvatar } from './UserAvatar';
import { useUserContext } from '../dataHooks/useContextData';
import { SmartLink } from './SmartNavigate';

const drawerWidth = 200;

interface NavBarItem {
    path?: string;
    icon: JSX.Element;
    text: string;
    onClick?: () => void;
}

// TODO: Add a way to choose drivers for the day
// TODO: Handle order creation
// TODO: Handle order update
// TODO: Handle order deletion
// TODO: Change Calendar color when it is today

export function NavBar() {
    const { session } = useUserContext();
    const [businessDate] = useBusinessDate();
    const { businessDatePicker, showBusinessDatePicker } = useBusinessDatePicker();

    const userListItem: NavBarItem = session
        ? { path: '/myaccount', icon: <UserAvatar />, text: 'Profile' }
        : { path: '/login', icon: <UserAvatar />, text: 'Login' };

    const listItems: NavBarItem[] = [
        { path: '/', icon: <HomeIcon />, text: 'Home' },
        {
            text: businessDate.format('MM/DD/YYYY'),
            icon: <CalendarIcon />,
            onClick: showBusinessDatePicker,
        },
        { path: '/search', icon: <Search />, text: 'Search' },
        { path: '/orders', icon: <LocalPizzaIcon />, text: 'Orders' },
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
