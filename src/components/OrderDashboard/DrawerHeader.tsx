import { Suspense } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { getAllDrawers, getAllDrivers } from "../../supabaseQueries";
import { Stack } from "@mui/material";
import { DrawerAvatar } from "./DrawerAvatar";

export const DrawerHeader = () => {
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

  const combinedData = [...drawers, ...drivers];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack
        direction="row"
        justifyContent="space-around"
        sx={{ height: 175, overflow: "hidden" }}
      >
        {combinedData?.map((drawer) => (
          <DrawerAvatar key={drawer.drawer_id} drawer={drawer} />
        ))}
      </Stack>
    </Suspense>
  );
};
