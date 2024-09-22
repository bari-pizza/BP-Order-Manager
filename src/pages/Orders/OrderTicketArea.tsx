import { Grid, Stack } from '@mui/material';
import { OrderTicket, OrderTicketSkeleton } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { useOrderDashboardContext } from '../../hooks/data/useContextData';
import { AnimatePresence, MotionProps } from 'framer-motion';
import { MotionWrapper } from '../../rickcedlib/MotionWrapper';

const motionProps: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 1 } },
};
export const OrderTicketArea = () => {
    const { orders, ticket } = useOrderDashboardContext();
    const drawerOrders = orders.forCurrentDrawer;

    return (
        <Stack className="hover-scroll" p={1} pb="50px" m={2}>
            <Stack className="hover-scroll-content">
                {drawerOrders?.length ? (
                    <AnimatePresence>
                        <MotionWrapper
                            motionProps={motionProps}
                            gridProps={{ justifyContent: 'space-between', container: true, rowGap: 3, columnGap: 1 }}
                            motionKey="orders">
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
                        </MotionWrapper>
                    </AnimatePresence>
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

export const OrderTicketAreaSkeleton = () => {
    return (
        <Grid container p={1} rowGap={1} columnGap={1} justifyContent="space-evenly" m={2}>
            {[...Array(8)].map((_, index) => (
                <OrderTicketSkeleton key={index} />
            ))}
        </Grid>
    );
};
