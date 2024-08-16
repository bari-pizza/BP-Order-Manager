import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllDaysOrders } from "../../supabaseQueries";

export const OrderTicketArea = () => {
  const { data: orders } = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: () => getAllDaysOrders({ year: 2024, month: 8, day: 14 }),
    staleTime: 1000 * 60 * 3,
  });

  // TODO: create an OrderTicket component and add useOrderEditor to it

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack>
        <Typography>Order Ticket Area</Typography>
        {orders?.map((order) => (
          <Card key={order.order_id}>
            <CardHeader title={order.order_number} />
            <CardContent>
              <Typography variant="body1">{order.phone}</Typography>
              <Typography variant="body1">
                ${(order.total_in_cents / 100).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Suspense>
  );
};
