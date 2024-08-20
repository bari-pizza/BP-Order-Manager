import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
    CardActionArea,
    Skeleton,
} from '@mui/material';
import { Order } from '../../supabaseQueries';
import { useOrderEditor } from './OrderEditor/useOrderEditor';

interface OrderTicketProps {
    order: Order;
    toggleCollapsed: (order: Order) => void;
    collapsed: boolean;
}

export const OrderTicket = ({ order, toggleCollapsed, collapsed }: OrderTicketProps) => {
    const { setOpen, orderEditor } = useOrderEditor({
        order,
        asDialog: true,
    });

    const cardSX = {
        width: 200,
        height: collapsed ? 100 : 300,
    };

    return (
        <Card variant="outlined" sx={cardSX}>
            <CardActionArea onClick={() => toggleCollapsed(order)}>
                <CardHeader title={`Order #${order.order_number}`} subheader={order.order_type} />
            </CardActionArea>
            <CardContent>
                <Typography variant="body1">{order.phone}</Typography>
                <Typography variant="body1">${(order.total_in_cents / 100).toFixed(2)}</Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => setOpen(true)}>Edit</Button>
            </CardActions>
            {orderEditor}
        </Card>
    );
};

export const OrderTicketSkeleton = () => {
    return (
        <Skeleton variant="rectangular">
            <Card sx={{ width: 200, height: 300 }} />
        </Skeleton>
    );
};
