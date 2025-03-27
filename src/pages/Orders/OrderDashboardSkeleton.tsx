import { Stack, Divider, Button } from '@mui/material';
import { SideBarSkeleton } from '../../components/SideBar';
import { DrawerHeaderSkeleton } from './DrawerHeaderSkeleton';
import { OrderTicketAreaSkeleton } from './OrderTicketArea';

export const OrderDashboardSkeleton = () => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} mt={2}>
            <DrawerHeaderSkeleton />
            <Divider />
            <OrderTicketAreaSkeleton />
            <SideBarSkeleton width="300px">
                <Button disabled>Add Order</Button>
                <Button disabled>Toggle Tickets</Button>
            </SideBarSkeleton>
        </Stack>
    );
};
