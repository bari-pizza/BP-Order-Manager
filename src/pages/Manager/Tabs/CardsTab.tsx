import { Stack } from '@mui/material';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { CardsTable } from '../Tables/CardsTable';
import { PaymentWithFullDetails } from '../../../typesAndValidators';

export const CardsTab = () => {
    const { orders, drivers, drawers, origins } = useManagerDashboardContext();
    const tablePayments: PaymentWithFullDetails[] = [];
    orders.all.forEach((order) => {
        const payments = order.payments;
        payments.forEach((payment) => {
            if (payment.payment_type === 'card') {
                const drawer = drawers.all.find((drawer) => drawer.drawer_id === order.drawer_id);
                const driver = drivers.todays.find((driver) => driver.drawer_id === order.drawer_id);
                const origin = origins.find((origin) => origin.origin_id === order.origin_id);
                tablePayments.push({
                    ...payment,
                    order,
                    drawer,
                    driver,
                    origin,
                });
            }
        });
    });
    return (
        <Stack direction="column" height="100%">
            <CardsTable payments={tablePayments} />
        </Stack>
    );
};
