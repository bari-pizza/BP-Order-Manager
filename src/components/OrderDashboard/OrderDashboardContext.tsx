import { createContext } from "react";
import type { Drawer, DriverDrawer } from "../supabaseQueries";

interface OrderDashboardContextProps {
  openDrawer: Drawer | DriverDrawer | null;
  setOpenDrawer: React.Dispatch<
    React.SetStateAction<Drawer | DriverDrawer | null>
  >;
}

export const OrderDashboardContext = createContext<OrderDashboardContextProps>({
  openDrawer: null,
  setOpenDrawer: () => {},
});
