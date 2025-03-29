import { Suspense, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    Grid,
    SpeedDial,
    SpeedDialAction,
    Stack,
} from '@mui/material';
import { Add as AddIcon, Bolt as BoltIcon, ReceiptLong as ReceiptLongIcon } from '@mui/icons-material';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';
import { DrawerHeader } from './DrawerHeader';
import { DrawerHeaderSkeleton } from './DrawerHeaderSkeleton';
import { OrderEditor } from './OrderEditor/OrderEditor';
import { SideBar } from '../../components/SideBar';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { OrderTicketArea, OrderTicketAreaSkeleton } from './OrderTicketArea';
import { useDrivers } from '../../hooks/data/useDrivers';
import { useDialogProps } from '../../hooks/ui/useDialogProps';
import { useMobile } from '../../hooks/data/useMobile';
import { ScrollableWindow } from '../../rickcedlib/components/ScrollableWindow';
import { OrderTicket } from './OrderTicket';
import { Player } from '@lottiefiles/react-lottie-player';
import { useLayoutContext } from '../../hooks/data/useContextData';
import { SummaryStack } from '../Manager/SideBar/SummaryStack';
import { formatCurrency } from '../../utils';

export const OrderDashboard = () => {
    const { isMobile } = useLayoutContext();

    return isMobile ? <OrderDashboardMobile /> : <OrderDashboardDesktop />;
};

const OrderDashboardDesktop = () => {
    const { drivers } = useDrivers();
    const { open, close, isOpen } = useDialogProps();
    const { ticket, drawer, orders, summaries, businessDay } = useOrdersDrawersTickets();

    return (
        <OrderDashboardContext.Provider value={{ ticket, drawer, orders, drivers, summaries }}>
            <Stack direction="column" sx={{ height: '100vh', overflowY: 'hidden' }} mt={2} className="order-dashboard">
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
                    {!isOpen && (
                        <Stack direction="column" m={2} gap={2}>
                            <Stack direction="row" justifyContent="space-between">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={ticket.all.select}
                                    disabled={businessDay.isLocked || ticket.all.count === 0}>
                                    {ticket.none.areSelected ? 'Select' : 'Unselect'} All Tickets
                                </Button>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" justifySelf={'center'}>
                                <Button
                                    id="add-order-button"
                                    fullWidth
                                    variant="contained"
                                    onClick={open}
                                    disabled={businessDay.isLocked}
                                    sx={{ height: '75px' }}>
                                    Add Order
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </SideBar>
        </OrderDashboardContext.Provider>
    );
};

const OrderDashboardMobile = () => {
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const { open: openEditor, close: closeEditor, isOpen: editorIsOpen } = useDialogProps();
    const { open: openSummary, close: closeSummary, isOpen: summaryIsOpen } = useDialogProps();
    const { driver, orders, ticket, driverIsWorkingToday, isRepeat, summary, cashTransfers: transfers } = useMobile();
    const [activeSummaryTab, setActiveSummaryTab] = useState(0);

    const handleOpen = () => setOpenSpeedDial(true);
    const handleClose = () => setOpenSpeedDial(false);

    const handleAddOrderClick = () => {
        setOpenSpeedDial(false);
        openEditor();
    };

    const handleOpenSummaryClick = () => {
        setOpenSpeedDial(false);
        openSummary();
    };
    // floating speed dial button to add order

    // create and edit orders in popup/drawer

    // statistics page (with link in navbar)

    if (!driver) return <div>Driver not found</div>;

    // TODO: make this responsive to changes

    if (!driverIsWorkingToday) return <div>Ask manager to assign you to work today</div>;

    const bankTransfers = transfers.bank;
    const pmtTransfers = transfers.payment;
    const otherTransfers = transfers.other;
    const closingPmtTransfer = pmtTransfers.find((pmt) => pmt.title === 'Closing Payment');
    const closingItems = [];
    const takeHomeItems = [];
    if (summary) {
        let total = 0,
            // orderCount = 0,
            cardBase = 0,
            cardTips = 0,
            // cashBase = 0,
            cashTips = 0,
            thirdPartyBase = 0,
            thirdPartyTips = 0,
            deliveryFees = 0;

        const bank = bankTransfers[0]?.amount_in_cents;
        const hours = summary.hours_in_cents;
        const hoursInCents = summary.hours_in_cents;
        const other = otherTransfers.reduce(
            (total, transfer) => total + (driver?.drawer_id === transfer.source ? -1 : 1) * transfer.amount_in_cents,
            0,
        );
        const pmts = pmtTransfers.reduce(
            (total, transfer) => total + (driver?.drawer_id === transfer.source ? -1 : 1) * transfer.amount_in_cents,
            0,
        );

        orders.forEach((order) => {
            total += order.total_in_cents;
            // orderCount += 1;
            deliveryFees += order.delivery_fee_in_cents;
            const payments = order.payments || [];
            payments.forEach((payment) => {
                if (payment.payment_type === 'cash') {
                    // cashBase += payment.amount_in_cents;
                    cashTips += payment.tip_in_cents;
                } else if (payment.payment_type === 'card') {
                    cardBase += payment.amount_in_cents;
                    cardTips += payment.tip_in_cents;
                } else if (payment.payment_type === 'third_party') {
                    thirdPartyBase += payment.amount_in_cents;
                    thirdPartyTips += payment.tip_in_cents;
                }
            });
        });

        closingItems.push(
            {
                label: 'Total',
                value: total,
            },
            {
                label: 'Bank',
                value: bank,
            },
            {
                label: 'Hours',
                value: -hoursInCents,
                detail: `${hours} hours @ ${formatCurrency(hoursInCents / hours)}`,
            },
            {
                label: 'Cards',
                value: -(cardBase + cardTips),
                details: `${formatCurrency(cardBase)} base |  ${formatCurrency(cardTips)} tips`,
            },
            {
                label: '3rd Party',
                value: -(thirdPartyBase + thirdPartyTips),
                details: `${formatCurrency(thirdPartyBase)} base |  ${formatCurrency(thirdPartyTips)} tips`,
            },
            {
                label: 'Delivery Fees',
                value: -deliveryFees,
                details: '$4 per order',
            },
            {
                label: 'Other',
                value: other,
            },
            {
                label: 'Payments',
                value: pmts,
                details: closingPmtTransfer
                    ? `Closing Payment: ${formatCurrency(closingPmtTransfer.amount_in_cents)}`
                    : 'No Closing Payment',
            },
        );

        takeHomeItems.push(
            {
                label: 'Hours',
                value: hoursInCents,
                detail: `${hours} hours @ ${formatCurrency(hoursInCents / hours)}`,
            },
            {
                label: 'Tips',
                value: cashTips + cardTips + thirdPartyTips,
                details: `${formatCurrency(cashTips)} cash | ${formatCurrency(cardTips)} card | ${formatCurrency(
                    thirdPartyTips,
                )} third party`,
            },
            {
                label: 'Delivery Fees',
                value: deliveryFees,
                details: '$4 per order',
            },
        );
    }

    const isLocked = summary?.is_locked || false;

    return (
        <>
            {isLocked ? (
                <Dialog open={summaryIsOpen} onClose={closeSummary} fullWidth maxWidth="sm">
                    <DialogTitle>{activeSummaryTab === 0 ? 'Closing Summary' : 'Take Home'}</DialogTitle>
                    {activeSummaryTab === 0 ? (
                        <SummaryStack items={closingItems} />
                    ) : (
                        <SummaryStack items={takeHomeItems} />
                    )}
                    <DialogActions>
                        <ButtonGroup>
                            <Button
                                onClick={() => setActiveSummaryTab(0)}
                                variant={activeSummaryTab === 0 ? 'contained' : 'outlined'}>
                                Closing Summary
                            </Button>
                            <Button
                                onClick={() => setActiveSummaryTab(1)}
                                variant={activeSummaryTab === 1 ? 'contained' : 'outlined'}>
                                Take Home
                            </Button>
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={editorIsOpen} onClose={closeEditor} fullWidth maxWidth="sm">
                    <OrderEditor
                        close={closeEditor}
                        isOpen={editorIsOpen}
                        forNewOrder
                        isRepeat={isRepeat}
                        driverDrawerID={driver.drawer_id}
                    />
                </Dialog>
            )}
            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<BoltIcon />}
                color="secondary"
                onClose={handleClose}
                onOpen={handleOpen}
                open={openSpeedDial}>
                {isLocked ? (
                    <SpeedDialAction
                        icon={<ReceiptLongIcon />}
                        tooltipTitle={'See Summary'}
                        onClick={handleOpenSummaryClick}
                    />
                ) : (
                    <SpeedDialAction icon={<AddIcon />} tooltipTitle={'Add Order'} onClick={handleAddOrderClick} />
                )}
            </SpeedDial>
            <Stack direction="column" className="order-dashboard">
                {orders.length ? (
                    <ScrollableWindow>
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
                    </ScrollableWindow>
                ) : (
                    <Player
                        src="https://lottie.host/538d9535-f6f3-41e0-be65-0bcbb04fa513/AUH39pGkWo.json"
                        loop
                        autoplay
                        style={{ width: '100%', height: '100%', maxHeight: '515px' }}
                    />
                )}
            </Stack>
        </>
    );
};
