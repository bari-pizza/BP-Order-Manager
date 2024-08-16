import { Link } from "react-router-dom";
import {
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  Search,
  Home as HomeIcon,
  LocalPizza as LocalPizzaIcon,
} from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const drawerWidth = 200;

interface NavBarItem {
  path?: string;
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}

export function NavBar() {
  const { profile } = useContext(UserContext);
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "X X";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("");
  const listItems: NavBarItem[] = [
    { path: "/", icon: <HomeIcon />, text: "Home" },
    { path: "/search", icon: <Search />, text: "Search" },
    { path: "/orders", icon: <LocalPizzaIcon />, text: "Orders" },
    {
      path: `/users/${profile?.id}`,
      icon: (
        <Avatar
          sx={{ height: "1.5em", width: "1.5em" }}
          role="current-user-avatar"
        >
          {initials}
        </Avatar>
      ),
      text: "Profile",
    },
  ];
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <List>
        {listItems.map((item) => (
          <ListItem
            component={item.path ? Link : "div"}
            to={item.path}
            key={item.text}
          >
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
