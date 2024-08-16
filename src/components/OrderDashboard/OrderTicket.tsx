import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import { Order } from "../../supabaseQueries";
import { useOrderEditor } from "./useOrderEditor";

interface OrderTicketProps {
  order: Order;
}

export const OrderTicket = ({ order }: OrderTicketProps) => {
  const { setOpen, orderEditor } = useOrderEditor({
    order,
    asDialog: true,
  });
  return (
    <Card variant="outlined" sx={{ width: 200, height: 300 }}>
      <CardHeader title={order.order_number} />
      <CardContent>
        <Typography variant="body1">{order.phone}</Typography>
        <Typography variant="body1">
          ${(order.total_in_cents / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpen(true)}>Edit</Button>
      </CardActions>
      {orderEditor}
    </Card>
  );
};
