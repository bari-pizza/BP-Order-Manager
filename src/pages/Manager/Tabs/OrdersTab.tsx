import { Stack } from '@mui/material';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { OrdersTable } from '../Tables/OrdersTable';
import { OrderWithFullDetails } from '../../../typesAndValidators';

export const OrdersTab = () => {
    // const { origins, drawers } = useBariPizzaContext();
    const { orders, drivers, drawers, origins } = useManagerDashboardContext();
    const tableOrders: OrderWithFullDetails[] = orders.all.map((order) => {
        const drawer = drawers.all.find((drawer) => drawer.drawer_id === order.drawer_id);
        const driver = drivers.todays.find((driver) => driver.drawer_id === order.drawer_id);
        const origin = origins.find((origin) => origin.origin_id === order.origin_id);
        return {
            ...order,
            drawer,
            driver,
            origin,
        };
    });
    return (
        <Stack direction="column" height="100%">
            <OrdersTable orders={tableOrders} />
        </Stack>
    );
};
