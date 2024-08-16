import { useContext } from "react";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import type { Drawer, DriverDrawer } from "../../supabaseQueries";
import { getDrawerFullName } from "../../utils";
import { OrderDashboardContext } from "./OrderDashboardContext";

interface DrawerAvatarProps {
  drawer: Drawer | DriverDrawer;
}

export const DrawerAvatar = ({ drawer }: DrawerAvatarProps) => {
  const { setOpenDrawer } = useContext(OrderDashboardContext);
  const fullName = getDrawerFullName(drawer);
  return (
    // large circle with image and name of drawer
    <Button onClick={() => setOpenDrawer(drawer)}>
      <Stack
        direction="column"
        sx={{ height: "100%", width: "min-content" }}
        alignItems="center"
      >
        <Avatar sx={{ height: "4em", width: "4em" }}>{fullName}</Avatar>
        <Typography>{fullName}</Typography>
      </Stack>
    </Button>
  );
};
