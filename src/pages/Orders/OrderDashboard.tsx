import { Suspense, useState } from 'react';
import { Button, Dialog, Divider, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { SideBar, SideBarSkeleton } from '../../components/SideBar';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useDialogProps } from '../../hooks/ui/useDialogProps';

export const OrderDashboard = () => {
    const { drivers } = useDrivers();
    const { open, close, isOpen } = useDialogProps();
    const { ticket, drawer, orders, summaries } = useOrdersDrawersTickets();

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders, drivers, summaries }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2}>
                <Suspense fallback={<DrawerHeaderSkeleton />}>
                    <DrawerHeader />
                </Suspense>
                <Divider />
                <Suspense fallback={<OrderTicketAreaSkeleton />}>
                    <OrderTicketArea />
                </Suspense>
            </Stack>
            <SideBar width="300px">
                <Stack alignContent="center" justifyContent="center" direction="column" height="100%">
                    <OrderEditor close={close} isOpen={isOpen} forNewOrder />
                    <Stack direction="column" m={2} gap={2}>
                        {!isOpen && (
                            <>
                                {ticket.all.count > 0 && (
                                    <>
                                        <Button variant="contained" onClick={ticket.all.select}>
                                            {ticket.none.areSelected ? 'Select' : 'Unselect'} All
                                        </Button>
                                    </>
                                )}
                                <Button variant="contained" onClick={open}>
                                    Add Order
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>
            </SideBar>
        </OrderDashboardContext.Provider>
    );
};

export const OrderDashboardMobile = () => {
    const { drivers } = useDrivers();
    const { ticket, drawer, orders, summaries } = useOrdersDrawersTickets();
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const { open: openEditor, close: closeEditor, isOpen: editorIsOpen } = useDialogProps();

    const handleOpen = () => setOpenSpeedDial(true);
    const handleClose = () => setOpenSpeedDial(false);

    const handleAddOrderClick = () => {
        setOpenSpeedDial(false);
        openEditor();
    };
    // floating speed dial button to add order

    // create and edit orders in popup/drawer

    // statistics page (with link in navbar)

    /* TODO: drivers need to be able to:

        - add orders
            - origin
            - drawer (self)
            - order type (delivery)
            - order #/name
            - delivery fee (default)
            - total

        - update orders
            - order #/name
            - total

        - request to delete orders

        - add payments
            - payment type
            - amount
            - tip

        - update payments
            - payment type
            - amount
            - tip

        - delete payments



        - access end of day payment slip

    */

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders, drivers, summaries }}>
            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                color="secondary"
                onClose={handleClose}
                onOpen={handleOpen}
                open={openSpeedDial}>
                <SpeedDialAction icon={<AddIcon />} tooltipTitle={'Add Order'} onClick={handleAddOrderClick} />
            </SpeedDial>
            <Stack direction="column" sx={{ height: '100%' }} mt={2}>
                <OrderTicketArea />
                <Dialog open={editorIsOpen} onClose={closeEditor}>
                    Let's add an order!
                </Dialog>
            </Stack>
        </OrderDashboardContext.Provider>
    );
};

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
