import { Grid } from '@mui/material';
import { Order } from '../../../supabaseQueries';
import { OrderTicket, OrderTicketSkeleton } from '../OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';

type OrderTicketAreaProps = {
    orders: Order[];
    collapsedTickets: string[];
    toggleTicket: (order: Order) => void;
};

export const OrderTicketArea = ({ orders, collapsedTickets, toggleTicket }: OrderTicketAreaProps) => {
    return (
        <Grid container p={1} rowGap={1} columnGap={1} justifyContent="space-evenly">
            {orders?.length ? (
                orders?.map((order) => (
                    <OrderTicket
                        key={order.order_id}
                        order={order}
                        toggleCollapsed={toggleTicket}
                        collapsed={collapsedTickets.includes(order.order_id)}
                    />
                ))
            ) : (
                <Player src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json" loop autoplay />
            )}
        </Grid>
    );
};

export const OrderTicketAreaSkeleton = () => {
    return (
        <Grid container p={1} rowGap={1} columnGap={1} justifyContent="space-evenly">
            {[...Array(8)].map((_, index) => (
                <OrderTicketSkeleton key={index} />
            ))}
        </Grid>
    );
};
