import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import { Order } from "../../supabaseQueries";
import { useOrderEditor } from "./OrderEditor/useOrderEditor";

interface OrderTicketProps {
  order: Order;
}

export const OrderTicket = ({ order }: OrderTicketProps) => {
  const { setOpen, orderEditor } = useOrderEditor({
    order,
    asDialog: true,
  });
  const [collapsed, setCollapsed] = useState(false);

  const cardSX = {
    width: 200,
    height: collapsed ? 100 : 300,
  };

  return (
    <Card variant="outlined" sx={cardSX}>
      <CardHeader title={order.order_number} />
      <CardContent>
        <Typography variant="body1">{order.phone}</Typography>
        <Typography variant="body1">
          ${(order.total_in_cents / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpen(true)}>Edit</Button>
        <Button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "Show" : "Hide"} Details
        </Button>
      </CardActions>
      {orderEditor}
    </Card>
  );
};
