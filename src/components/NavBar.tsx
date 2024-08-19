import { Link } from 'react-router-dom';
import { Toolbar, Drawer, List, ListItemButton, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import { Search, Home as HomeIcon, LocalPizza as LocalPizzaIcon } from '@mui/icons-material';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useBusinessDatePicker } from './BusinessDatePicker/useBusinessDatePicker';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useBusinessDate } from './BusinessDatePicker/useBusinessDate';
import { UserAvatar } from './UserAvatar';

const drawerWidth = 200;

interface NavBarItem {
    path?: string;
    icon: JSX.Element;
    text: string;
    onClick?: () => void;
}

export function NavBar() {
    const { session } = useContext(UserContext);
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
                        component={item.path ? Link : 'div'}
                        to={item.path}
                        {...(item.path ? { unstable_viewTransition: true } : {})}
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
