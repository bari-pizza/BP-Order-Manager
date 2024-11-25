import { Suspense, useState } from 'react';
import { Button, Dialog, Divider, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader, DrawerHeaderSkeleton } from './DrawerHeader';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { SideBar, SideBarSkeleton } from '../../components/SideBar';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { useMobile } from '../../hooks/data/useMobile';
import { ScrollableWindow } from '../../rickcedlib/ScrollableWindow';
import { OrderTicket } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { useLayoutContext } from '../../hooks/data/useContextData';

export const OrderDashboard = () => {
    const { isMobile } = useLayoutContext();

    return isMobile ? <OrderDashboardMobile /> : <OrderDashboardDesktop />;
};

const OrderDashboardDesktop = () => {
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
                    <OrderEditor close={close} isOpen={isOpen} forNewOrder isRepeat={orders.isRepeat} />
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

const OrderDashboardMobile = () => {
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const { open: openEditor, close: closeEditor, isOpen: editorIsOpen } = useDialogProps();
    const { driver, orders, ticket, driverIsWorkingToday, isRepeat } = useMobile();

    const handleOpen = () => setOpenSpeedDial(true);
    const handleClose = () => setOpenSpeedDial(false);

    const handleAddOrderClick = () => {
        setOpenSpeedDial(false);
        openEditor();
    };
    // floating speed dial button to add order

    // create and edit orders in popup/drawer

    // statistics page (with link in navbar)

    if (!driver) return <div>Driver not found</div>;

    // TODO: make this responsive to changes

    if (!driverIsWorkingToday) return <div>Ask manager to assign you to work today</div>;

    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                color="secondary"
                onClose={handleClose}
                onOpen={handleOpen}
                open={openSpeedDial}>
                <SpeedDialAction icon={<AddIcon />} tooltipTitle={'Add Order'} onClick={handleAddOrderClick} />
            </SpeedDial>
            <Stack direction="column">
                {orders.length ? (
                    <ScrollableWindow>
                        {/* <Stack direction="column" alignItems="center" rowGap={3}> */}
                        <Grid alignItems="center" rowGap={3} container columnGap={1} justifyContent="center">
                            {orders.map((order) => {
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
                        {/* </Stack> */}
                    </ScrollableWindow>
                ) : (
                    <Player
                        src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
                        loop
                        autoplay
                        style={{ width: '100%', height: '100%', maxHeight: '515px' }}
                    />
                )}
                <Dialog open={editorIsOpen} onClose={closeEditor} fullWidth maxWidth="sm">
                    <OrderEditor
                        close={closeEditor}
                        isOpen={editorIsOpen}
                        forNewOrder
                        isRepeat={isRepeat}
                        driverDrawerID={driver.drawer_id}
                    />
                </Dialog>
            </Stack>
        </>
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
