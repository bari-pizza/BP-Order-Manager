import { Grid, Stack } from '@mui/material';
import { OrderTicket, OrderTicketSkeleton } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';

export const OrderTicketArea = () => {
    const { orders, ticket } = useOrderDashboardContext();
    const drawerOrders = orders.forCurrentDrawer;
    return (
        <Stack className="hover-scroll" p={1} pb="50px">
            <Grid container rowGap={3} columnGap={1} justifyContent="space-between">
                {drawerOrders?.length ? (
                    drawerOrders?.map((order) => (
                        <OrderTicket
                            order={order}
                            key={order.order_id}
                            toggleCollapsed={() => ticket.collapse(order)}
                            collapsed={ticket.isCollapsed(order)}
                            toggleSelected={() => ticket.select(order)}
                            selected={ticket.isSelected(order)}
                        />
                    ))
                ) : (
                    <Player
                        src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
                        loop
                        autoplay
                    />
                )}
            </Grid>
        </Stack>
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
