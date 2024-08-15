import { useState } from "react";
import type { Drawer, DriverDrawer } from "../../supabaseQueries";
import { Divider, Stack } from "@mui/material";
import { OrderDashboardContext } from "./OrderDashboardContext";
import { DrawerHeader } from "./DrawerHeader";
import { QuickInfoArea } from "./QuickInfoArea";
import { OrderTicketArea } from "./OrderTicketArea";

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
