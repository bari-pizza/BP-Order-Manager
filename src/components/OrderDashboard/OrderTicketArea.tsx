import { Suspense } from "react";
import { Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllDaysOrders } from "../../supabaseQueries";
import { OrderTicket } from "./OrderTicket";

export const OrderTicketArea = () => {
  const { data: orders } = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: () => getAllDaysOrders({ year: 2024, month: 8, day: 14 }),
    staleTime: 1000 * 60 * 3,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack>
        <Typography>Order Ticket Area</Typography>
        {orders?.map((order) => (
          <OrderTicket key={order.order_id} order={order} />
        ))}
      </Stack>
    </Suspense>
  );
};
