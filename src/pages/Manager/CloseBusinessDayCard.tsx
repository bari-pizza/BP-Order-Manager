import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { useManagerDashboardContext } from '../../hooks/data/useContextData';
import { Drawer, Driver_Drawer, Order } from '../../typesAndValidators';

export const CloseBusinessDayCard = () => {
    const { open, close, isOpen } = useDialogProps();
    const { combinedDrawersAndDrivers, summaries, orders } = useManagerDashboardContext();

    const openDrawers: (Drawer | Driver_Drawer)[] = [];
    const openOrders: Order[] = [];

    combinedDrawersAndDrivers.forEach((drawer) => {
        // [x] should confirm that all drawers are locked
        if (!summaries.byDrawerID(drawer.drawer_id)?.is_locked) {
            openDrawers.push(drawer);
        }
    });

    orders.all.forEach((order) => {
        // [x] should confirm that all orders are assigned to a drawer
        if (!order.drawer_id) {
            openOrders.push(order);
        }
    });

    const canClose = openDrawers.length === 0 && openOrders.length === 0;

    const handleCloseBusinessDay = () => {
        if (canClose) {
            close();
        }
    };

    return (
        <>
            <Button onClick={open}>Close Business Day</Button>
            <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>Close Business Day</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2} textAlign="center">
                        {!canClose && (
                            <Typography variant="body2" color="error">
                                You cannot close the business day until all drawers and orders are closed
                            </Typography>
                        )}
                        {openDrawers.length > 0 ? (
                            openDrawers.map((drawer) => (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    key={drawer.drawer_id}
                                    justifyContent="space-between">
                                    <Typography variant="body1">Open Drawer</Typography>
                                    <Typography variant="body1">{drawer.name}</Typography>
                                </Stack>
                            ))
                        ) : (
                            <Typography variant="h6">No Open Drawers</Typography>
                        )}
                        <Divider />
                        {openOrders.length > 0 ? (
                            <>
                                {openOrders.slice(0, 4).map((order) => (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        key={order.order_id}
                                        justifyContent="space-between">
                                        <Typography variant="body1">Unassigned Order</Typography>
                                        <Typography variant="body1">
                                            {order.order_number ? 'Order #' + order.order_number : order.order_name}
                                        </Typography>
                                    </Stack>
                                ))}
                                {openOrders.length > 4 && (
                                    <Typography variant="body2" color="textSecondary" textAlign="right">
                                        and {openOrders.length - 4} other unassigned orders
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="h6">No Unassigned Orders</Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBusinessDay} disabled={!canClose} variant="contained">
                        Close Day
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
