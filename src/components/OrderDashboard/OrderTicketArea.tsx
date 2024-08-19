import { Stack } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllDaysOrders } from '../../supabaseQueries';
import { OrderTicket } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { dayjsToMDY } from '../../utils';
import { useBusinessDate } from '../../dataHooks/useBusinessDate';

export const OrderTicketArea = () => {
    const [businessDate] = useBusinessDate();
    const MDY = dayjsToMDY(businessDate);
    const { data: orders } = useSuspenseQuery({
        queryKey: ['orders', businessDate.format('MM/DD/YYYY')],
        queryFn: () => getAllDaysOrders(MDY),
    });

    return (
        <Stack>
            {orders?.length ? (
                orders?.map((order) => <OrderTicket key={order.order_id} order={order} />)
            ) : (
                <Player src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json" loop autoplay />
            )}
        </Stack>
    );
};
