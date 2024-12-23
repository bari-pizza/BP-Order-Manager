import { Grid, Stack } from '@mui/material';
import { OrderTicket, OrderTicketSkeleton } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';

export const OrderTicketArea = () => {
    const { orders, ticket } = useOrderDashboardContext();
    const drawerOrders = orders.forCurrentDrawer;

    return (
        <Stack className="hover-scroll" p={1} pb="50px" m={2}>
            <Stack className="hover-scroll-content">
                {drawerOrders?.length ? (
                    <Grid container rowGap={3} columnGap={1} justifyContent="space-between">
                        {drawerOrders?.map((order) => {
                            return (
                                <OrderTicket
                                    order={order}
                                    key={order.order_id}
                                    toggleSelected={() => ticket.select(order)}
                                    selected={ticket.isSelected(order)}
                                />
                            );
                        })}
                    </Grid>
                ) : (
                    <Player
                        src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
                        loop
                        autoplay
                        style={{ width: '100%', height: '100%', maxHeight: '515px' }}
                    />
                )}
            </Stack>
        </Stack>
    );
};

// UNUSED
// export const OrderTicketMobileArea = () => {
//     const { orders, ticket } = useOrderDashboardContext();
//     const drawerOrders = orders.forCurrentDrawer;

//     return (
//         <Stack className="hover-scroll" p={1} pb="50px" m={2}>
//             <Stack className="hover-scroll-content">
//                 {drawerOrders?.length || 0}
//                 {drawerOrders?.length ? (
//                     <Grid container rowGap={3} columnGap={1} justifyContent="space-between">
//                         {drawerOrders?.map((order) => {
//                             return (
//                                 <OrderTicket
//                                     order={order}
//                                     key={order.order_id}
//                                     toggleSelected={() => ticket.select(order)}
//                                     selected={ticket.isSelected(order)}
//                                 />
//                             );
//                         })}
//                     </Grid>
//                 ) : (
//                     <Player
//                         src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
//                         loop
//                         autoplay
//                         style={{ width: '100%', height: '100%', maxHeight: '515px' }}
//                     />
//                 )}
//             </Stack>
//         </Stack>
//     );
// };

export const OrderTicketAreaSkeleton = () => {
    return (
        <Grid container p={1} rowGap={1} columnGap={1} justifyContent="space-evenly" m={2}>
            {[...Array(8)].map((_, index) => (
                <OrderTicketSkeleton key={index} />
            ))}
        </Grid>
    );
};
