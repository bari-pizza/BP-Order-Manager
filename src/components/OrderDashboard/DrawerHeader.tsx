import { useSuspenseQueries } from "@tanstack/react-query";
import {
  getAllDrawers,
  getAllDrivers,
  queryFnWrapper,
} from "../../supabaseQueries";
import { Stack } from "@mui/material";
import { DrawerAvatar, DrawerAvatarSkeleton } from "./DrawerAvatar";

export const DrawerHeader = () => {
  const [{ data: drawers }, { data: drivers }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["drawers"],
        queryFn: queryFnWrapper(getAllDrawers, 10000),
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["drivers"],
        queryFn: queryFnWrapper(getAllDrivers, 10000),
        staleTime: 1000 * 60 * 1,
      },
    ],
  });

  const combinedData = [...drawers, ...drivers];

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{ height: 175, overflow: "hidden" }}
    >
      {combinedData?.map((drawer) => (
        <DrawerAvatar key={drawer.drawer_id} drawer={drawer} />
      ))}
    </Stack>
  );
};

export const DrawerHeaderSkeleton = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{ height: 175, overflow: "hidden" }}
    >
      <DrawerAvatarSkeleton />
      <DrawerAvatarSkeleton />
      <DrawerAvatarSkeleton />
      <DrawerAvatarSkeleton />
    </Stack>
  );
};
