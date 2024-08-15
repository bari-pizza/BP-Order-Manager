import { Drawer, DriverDrawer } from "./supabaseQueries";

export const getDrawerFullName = (drawer: Drawer | DriverDrawer) => {
  if ("driver" in drawer) {
    return `${drawer.driver.first_name} ${drawer.driver.last_name}`;
  }
  return drawer.name;
};
