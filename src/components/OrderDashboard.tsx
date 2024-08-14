import { createContext, useContext, useState } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { getAllDrawers, getAllDrivers } from "../supabaseQueries";
import type { Drawer, DriverDrawer } from "../supabaseQueries";
import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";

const getDrawerFullName = (drawer: Drawer | DriverDrawer) => {
  if ("driver" in drawer) {
    return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
  }
  return drawer.name;
};

interface DrawerProps {
  drawer: Drawer | DriverDrawer;
}

const Drawer = ({ drawer }: DrawerProps) => {
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

const DrawerHeader = () => {
  const [{ data: drawers }, { data: drivers }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["drawers"],
        queryFn: getAllDrawers,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["drivers"],
        queryFn: getAllDrivers,
        staleTime: 1000 * 60 * 1,
      },
    ],
  });

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ height: 175, overflow: "hidden" }}
    >
      {drawers?.map((drawer) => (
        <Drawer key={drawer.drawer_id} drawer={drawer} />
      ))}
      {drivers?.map((drawer) => {
        return <Drawer key={drawer.drawer_id} drawer={drawer} />;
      })}
    </Stack>
  );
};

const QuickInfoArea = () => {
  const { openDrawer: drawer } = useContext(OrderDashboardContext);
  if (!drawer) {
    return <Stack sx={{ height: 150 }}></Stack>;
  }
  const fullName = getDrawerFullName(drawer);
  return (
    <Stack sx={{ height: 150 }}>
      <Typography>{fullName} info goes here!</Typography>
    </Stack>
  );
};

interface OrderDashboardContextProps {
  openDrawer: Drawer | DriverDrawer | null;
  setOpenDrawer: React.Dispatch<
    React.SetStateAction<Drawer | DriverDrawer | null>
  >;
}

const OrderDashboardContext = createContext<OrderDashboardContextProps>({
  openDrawer: null,
  setOpenDrawer: () => {},
});

const OrderTicketArea = () => {
  return (
    <Stack>
      <Typography>Order Ticket Area</Typography>
    </Stack>
  );
};

export const OrderDashboard = () => {
  const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(
    null
  );

  return (
    <OrderDashboardContext.Provider value={{ openDrawer, setOpenDrawer }}>
      <Stack direction="column" sx={{ height: "100%" }}>
        <DrawerHeader />
        <Divider />
        <QuickInfoArea />
        <Divider />
        <OrderTicketArea />
      </Stack>
    </OrderDashboardContext.Provider>
  );
};
