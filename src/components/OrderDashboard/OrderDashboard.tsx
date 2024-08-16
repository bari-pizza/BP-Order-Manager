import { useState, useContext } from "react";
import type { Drawer, DriverDrawer } from "../../supabaseQueries";
import { Button, Divider, Stack } from "@mui/material";
import { Portal } from "@mui/base";
import { OrderDashboardContext } from "./OrderDashboardContext";
import { DrawerHeader } from "./DrawerHeader";
import { QuickInfoArea } from "./QuickInfoArea";
import { OrderTicketArea } from "./OrderTicketArea";
import { LayoutContext } from "../../LayoutContext";
import { useOrderEditor } from "./useOrderEditor";

export const OrderDashboard = () => {
  const [openDrawer, setOpenDrawer] = useState<Drawer | DriverDrawer | null>(
    null
  );
  const { sideBarRef } = useContext(LayoutContext);

  const { orderEditor, open, setOpen } = useOrderEditor();

  const toggleOrderEditor = () => {
    setOpen((prev) => !prev);
  };

  return (
    <OrderDashboardContext.Provider value={{ openDrawer, setOpenDrawer }}>
      <Stack direction="column" sx={{ height: "100%" }}>
        <DrawerHeader />
        <Divider />
        <QuickInfoArea />
        <Divider />
        <OrderTicketArea />
        <Portal container={sideBarRef?.current}>
          {!open && <Button onClick={toggleOrderEditor}>Add Order</Button>}
          {orderEditor}
        </Portal>
      </Stack>
    </OrderDashboardContext.Provider>
  );
};
