import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useBariPizzaContext, useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { SideBar, SideBarSkeleton } from '../../../components/SideBar';
import { DrawerCardBaseSkeleton, DrawerCardSlotProps } from '../../../components/Base/DrawerCardBase';
import { ContextMenu } from '../../../components/Base/ContextMenu';
import { DrawerCard } from '../DrawerCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MotionWrapper } from '../../../rickcedlib/MotionWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { BusinessDayDrawerSummary } from '../../../typesAndValidators';
import {
    // useEffect, useMemo,
    useState,
} from 'react';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { SummaryStack } from './SummaryStack';
import { formatCurrency } from '../../../utils';
import { CashTransferEditor } from './CashTransferEditor';

type FormValues = BusinessDayDrawerSummary;

export const DrawerSideBar = () => {
    const { open, close, isOpen } = useDialogProps();
    const { open: openCashTransfers, close: closeCashTransfers, isOpen: isOpenCashTransfers } = useDialogProps();
    const [businessDate] = useBusinessDate();
    const { constants } = useBariPizzaContext();
    const { orders, drawers, summaries, cashTransfers, drivers } = useManagerDashboardContext();

    const [editableCashTransferID, setEditableCashTransferID] = useState<string | null>(null);

    // KEEP: if a driver is saved in localstorage, make sure they're currently working
    const currentDrawerExists =
        drawers.current?.drawer_type !== 'driver' ||
        drivers.todays.some((driver) => driver.drawer_id === drawers.current?.drawer_id);

    const currentDrawer = currentDrawerExists ? drawers.current : null;
    const currentDrawerID = currentDrawer?.drawer_id || '';
    const summary = summaries.byDrawerID(currentDrawerID);

    const transfers = cashTransfers.forCurrentDrawer;
    const bankTransfers = transfers.bank;
    const pmtTransfers = transfers.payment;
    const otherTransfers = transfers.other;
    const closingPmtTransfer = pmtTransfers.find((pmt) => pmt.title === 'Closing Payment');

    /*TODO: ***Cash Transfer ****
        get all cash transfers in context (figure out if I need them in any other screens)

        find bank cash transfer for drawer
        if doesnt exist, use default value
        if exists, use value

        on save, create new cash transfer with bank_in_cents value
        or update cash transfer with bank_in_cents value

        allow user to change bank source 

        implement a way to create other cash transfers

        determine payment to be created

        backend - if source or destination is_locked, don't allow changes

        create popup to show all cash transfers and edit/delete them

    
    */

    const defaultValues = {
        business_date: businessDate.format('YYYY-MM-DD'),
        drawer_id: currentDrawer?.drawer_id,
        bank_in_cents: bankTransfers.reduce((acc, transfer) => acc + transfer.amount_in_cents, 0),
        hours: summary?.hours || 0,
        hours_in_cents: summary?.hours_in_cents || 0,
        other_in_cents: otherTransfers.reduce((acc, transfer) => acc + transfer.amount_in_cents, 0),
        is_locked: summary?.is_locked || false,
        special_note: summary?.special_note || '',
    };

    console.log({ summary, defaultValues });

    // const defaultValues = useMemo(() => {
    //     return {
    //         bank_in_cents: bankTransfer?.amount_in_cents || constants.default.driver_starting_cash_in_cents,
    //         register_in_cents: constants.default.register_starting_cash_in_cents,
    //         hours: 0,
    //         hours_in_cents: 0,
    //         other_in_cents: 0,
    //         business_date: businessDate.format('YYYY-MM-DD'),
    //         drawer_id: currentDrawer?.drawer_id,
    //         is_locked: false,
    //         special_note: '',
    //         ...summary,
    //     };
    // }, [constants, currentDrawer, businessDate, summary, bankTransfer]);

    // TODO: ***is locked logic***

    // BusinessDaySummary can only be locked if all Drawers and Orders are locked

    // TODO: ***CONTINUE*** only need make hours editable

    const { handleSubmit, register } = useForm<FormValues>({
        defaultValues: summary || defaultValues,
    });

    if (!currentDrawer || currentDrawer.name === 'Unassigned') {
        return null;
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const cleanedData = {
            ...data,
            drawer_id: currentDrawer.drawer_id,
            hours_in_cents: data.hours * constants.default.driver_hourly_wage_in_cents,
        };
        // drawerID is empty for some reason
        console.log(data, cleanedData, defaultValues, currentDrawer);
        summaries.update(cleanedData);
    };

    const drawersOrders = orders.byDrawerID(currentDrawer.drawer_id);
    const drawerSummary = {
        bank_in_cents: bankTransfers[0]?.amount_in_cents || 0,
        total_in_cents: 0,
        orders: 0,
        cash_in_cents: 0,
        card_in_cents: 0,
        hours: summary?.hours || 0,
        hours_in_cents: summary?.hours_in_cents || 0,
        third_party_in_cents: 0,
        cash_tips_in_cents: 0,
        card_tips_in_cents: 0,
        third_party_tips_in_cents: 0,
        delivery_fees_in_cents: 0,
    };
    drawersOrders.forEach((order) => {
        drawerSummary.total_in_cents += order.total_in_cents;
        drawerSummary.orders += 1;
        drawerSummary.delivery_fees_in_cents += order.delivery_fee_in_cents;
        order.payments.forEach((payment) => {
            if (payment.payment_type === 'cash') {
                drawerSummary.cash_in_cents += payment.amount_in_cents;
                drawerSummary.cash_tips_in_cents += payment.tip_in_cents;
            } else if (payment.payment_type === 'card') {
                drawerSummary.card_in_cents += payment.amount_in_cents;
                drawerSummary.card_tips_in_cents += payment.tip_in_cents;
            } else if (payment.payment_type === 'third_party') {
                drawerSummary.third_party_in_cents += payment.amount_in_cents;
                drawerSummary.third_party_tips_in_cents += payment.tip_in_cents;
            }
        });
    });

    const sx = {
        avatar: {
            width: '6em',
            height: '6em',
        },
        avatarIcon: {
            width: '4em',
            height: '4em',
        },
        button: {
            height: '12em',
            width: '300px',
            '&.open-drawer': {
                backgroundColor: 'orange',
            },
        },
    };

    const props: DrawerCardSlotProps = {
        button: { variant: 'text', disabled: true, disableRipple: true },
        buttonStack: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        nameTypography: { variant: 'h6' },
    };

    const motionProps = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const isDriver = 'driver' in currentDrawer;

    const handleCloseDrawerClick = () => {
        handleSubmit(onSubmit)();
        open();
    };

    const handleDrawerClosureClick = () => {
        drawers.close(currentDrawer);
        close();
    };

    const handleReopenDrawerClick = () => {
        console.log(`Reopening drawer ${currentDrawer.name}`);
        drawers.reOpen(currentDrawer);
    };

    const total = drawerSummary.total_in_cents;
    // const bank = watch('bank_in_cents');
    const bank = drawerSummary.bank_in_cents;
    // const hours = watch('hours_in_cents');
    const hours = drawerSummary.hours_in_cents;
    const card = drawerSummary.card_in_cents + drawerSummary.card_tips_in_cents;
    const thirdParty = drawerSummary.third_party_in_cents + drawerSummary.third_party_tips_in_cents;
    const deliveryFees = drawerSummary.delivery_fees_in_cents;
    // const other = watch('other_in_cents');
    const other = otherTransfers.reduce(
        (acc, { amount_in_cents, source }) => (source === currentDrawer.drawer_id ? -1 : 1) * amount_in_cents + acc,
        0,
    );
    const payments = pmtTransfers.reduce(
        (acc, { amount_in_cents, source }) => (source === currentDrawer.drawer_id ? -1 : 1) * amount_in_cents + acc,
        0,
    );
    const items = [];
    switch (currentDrawer.drawer_type) {
        case 'driver':
            items.push(
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
                    value: -hours,
                },
                {
                    label: 'Cards',
                    value: -card,
                },
                {
                    label: '3rd Party',
                    value: -thirdParty,
                },
                {
                    label: 'Deliveries',
                    value: -deliveryFees,
                },
                {
                    label: 'Other',
                    value: other,
                },
                {
                    label: 'Payments',
                    value: payments,
                },
            );
            break;
        case 'register':
            items.push(
                {
                    label: 'Total',
                    value: total,
                },
                {
                    label: 'Cards',
                    value: -card,
                },
            );
            break;
        case 'third_party':
            items.push(
                {
                    label: 'DoorDash',
                    value: total,
                },
                {
                    label: 'GrubHub',
                    value: other,
                },
            );
            break;
    }
    const isLocked = summary?.is_locked || false;

    const outstandingAmount = items.reduce((acc, item) => acc + item.value, 0);

    const closingPmtAmount =
        outstandingAmount -
        (closingPmtTransfer
            ? closingPmtTransfer.amount_in_cents * (closingPmtTransfer.source === currentDrawer.drawer_id ? -1 : 1)
            : 0);

    const handleClosingPaymentClick = () => {
        setEditableCashTransferID('closing-cash-transfer');
    };

    return (
        <SideBar width="350px">
            <Stack direction="column" height="100vh" spacing={2} alignItems="center" mt={2}>
                <Stack direction="column" alignItems="center" gap={2}>
                    <AnimatePresence>
                        <ContextMenu openOnType="click">
                            <ContextMenu.Base>
                                <MotionWrapper motionProps={motionProps} motionKey={currentDrawer.drawer_id}>
                                    <DrawerCard
                                        drawer={currentDrawer}
                                        sx={sx}
                                        props={props}
                                        canOpen={false}
                                        isLocked={summary?.is_locked}
                                    />
                                </MotionWrapper>
                            </ContextMenu.Base>
                            <DrawerCard.contextMenu drawer={currentDrawer} />
                        </ContextMenu>
                    </AnimatePresence>
                    {isLocked ? (
                        <>
                            <SummaryStack items={items} />
                            <Button onClick={handleReopenDrawerClick}>Reopen Drawer</Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">ORDERS: {drawerSummary.orders}</Typography>
                            <Typography variant="h6">TOTAL: {formatCurrency(drawerSummary.total_in_cents)}</Typography>

                            {currentDrawer.drawer_type !== 'third_party' && (
                                <Button onClick={openCashTransfers}>Cash Transfers</Button>
                            )}
                            {isDriver && (
                                <>
                                    <TextField label="Hours" {...register('hours')} />
                                </>
                            )}
                            <Button onClick={handleCloseDrawerClick}>Save & Close Drawer</Button>
                        </>
                    )}
                    <Button onClick={() => drawers.onClick(drawers.current!)}>Collapse SideBar</Button>
                    <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
                        <DialogTitle>Confirm Drawer Close</DialogTitle>
                        <DialogContent>
                            <SummaryStack items={items} />
                        </DialogContent>
                        <DialogActions>
                            {outstandingAmount !== 0 ? (
                                <>
                                    {editableCashTransferID === 'closing-cash-transfer' ? (
                                        closingPmtTransfer ? (
                                            <CashTransferEditor
                                                key="closing-cash-transfer"
                                                isEditing
                                                setIsEditing={(bool) =>
                                                    setEditableCashTransferID(bool ? 'closing-cash-transfer' : null)
                                                }
                                                drawerID={currentDrawer.drawer_id}
                                                cashTransfer={{
                                                    ...closingPmtTransfer,
                                                    amount_in_cents: Math.abs(closingPmtAmount),
                                                    source: closingPmtAmount > 0 ? currentDrawer.drawer_id : '',
                                                    destination: closingPmtAmount < 0 ? currentDrawer.drawer_id : '',
                                                }}
                                            />
                                        ) : (
                                            <CashTransferEditor
                                                key="closing-cash-transfer"
                                                isEditing
                                                setIsEditing={(bool) =>
                                                    setEditableCashTransferID(bool ? 'closing-cash-transfer' : null)
                                                }
                                                forNewCashTransfer
                                                drawerID={currentDrawer.drawer_id}
                                                transferType="payment"
                                                definedValues={{
                                                    cashTransfer: {
                                                        amount_in_cents: Math.abs(outstandingAmount),
                                                        source: outstandingAmount > 0 ? currentDrawer.drawer_id : '',
                                                        destination:
                                                            outstandingAmount < 0 ? currentDrawer.drawer_id : '',
                                                        title: 'Closing Payment',
                                                    },
                                                    completedFirstStep: true,
                                                    toFromSpentReceived: outstandingAmount < 0 ? 'from' : 'to',
                                                    validDrawerFilter: (drawer) => drawer.drawer_type === 'register',
                                                }}
                                            />
                                        )
                                    ) : (
                                        <>
                                            <Button onClick={close} variant="outlined" color="error">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleClosingPaymentClick} variant="contained">
                                                {closingPmtTransfer ? 'Edit' : 'Create'} Closing Payment
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Button onClick={handleDrawerClosureClick} variant="contained">
                                    Confirm Drawer Closure
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                    <Dialog open={isOpenCashTransfers} onClose={closeCashTransfers} fullWidth maxWidth="sm">
                        <DialogTitle>Cash Transfers for {currentDrawer.name}</DialogTitle>
                        <DialogContent>
                            {bankTransfers
                                .sort((a, b) => a.created_at.localeCompare(b.created_at))
                                .map((cashTransfer) => (
                                    <motion.div key={cashTransfer.cash_transfer_id} whileHover={{ scale: 1.05 }}>
                                        <CashTransferEditor
                                            key={cashTransfer.cash_transfer_id}
                                            isEditing={editableCashTransferID === cashTransfer.cash_transfer_id}
                                            setIsEditing={(bool) =>
                                                setEditableCashTransferID(bool ? cashTransfer.cash_transfer_id : null)
                                            }
                                            cashTransfer={cashTransfer}
                                            drawerID={currentDrawer.drawer_id}
                                            transferType="bank"
                                        />
                                    </motion.div>
                                ))}
                            {pmtTransfers
                                .sort((a, b) => a.created_at.localeCompare(b.created_at))
                                .map((cashTransfer) => (
                                    <motion.div key={cashTransfer.cash_transfer_id} whileHover={{ scale: 1.05 }}>
                                        <CashTransferEditor
                                            key={cashTransfer.cash_transfer_id}
                                            isEditing={editableCashTransferID === cashTransfer.cash_transfer_id}
                                            setIsEditing={(bool) =>
                                                setEditableCashTransferID(bool ? cashTransfer.cash_transfer_id : null)
                                            }
                                            cashTransfer={cashTransfer}
                                            drawerID={currentDrawer.drawer_id}
                                            transferType="payment"
                                        />
                                    </motion.div>
                                ))}
                            {otherTransfers
                                .sort((a, b) => a.created_at.localeCompare(b.created_at))
                                .map((cashTransfer) => (
                                    <motion.div key={cashTransfer.cash_transfer_id} whileHover={{ scale: 1.05 }}>
                                        <CashTransferEditor
                                            key={cashTransfer.cash_transfer_id}
                                            isEditing={editableCashTransferID === cashTransfer.cash_transfer_id}
                                            setIsEditing={(bool) =>
                                                setEditableCashTransferID(bool ? cashTransfer.cash_transfer_id : null)
                                            }
                                            cashTransfer={cashTransfer}
                                            drawerID={currentDrawer.drawer_id}
                                        />
                                    </motion.div>
                                ))}
                            <CashTransferEditor
                                forNewCashTransfer
                                key="newCashTransfer"
                                isEditing={editableCashTransferID === 'newCashTransfer'}
                                setIsEditing={(bool) => setEditableCashTransferID(bool ? 'newCashTransfer' : null)}
                                drawerID={currentDrawer.drawer_id}
                                canCreateBankTransfer={
                                    bankTransfers.length === 0 && currentDrawer.drawer_type === 'driver'
                                }
                            />
                        </DialogContent>
                    </Dialog>
                </Stack>
            </Stack>
        </SideBar>
    );
};

export const DrawerSideBarSkeleton = () => {
    const sx = {
        avatar: {
            width: '6em',
            height: '6em',
        },
        avatarIcon: {
            width: '4em',
            height: '4em',
        },
        button: {
            height: '12em',
            width: '300px',
            '&.open-drawer': {
                backgroundColor: 'orange',
            },
        },
    };

    const props: DrawerCardSlotProps = {
        button: { variant: 'text', disabled: true, disableRipple: true },
        buttonStack: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        nameTypography: { variant: 'h6' },
    };
    return (
        <SideBarSkeleton width="350px">
            <Stack direction="column" height="100vh" spacing={2} alignItems="center" mt={2}>
                <Stack direction="column" alignItems="center" gap={2}>
                    <DrawerCardBaseSkeleton sx={sx} props={props} />

                    <Skeleton>
                        <Typography variant="h6">ORDERS: 10</Typography>
                    </Skeleton>
                    <Skeleton>
                        <Typography variant="h6">TOTAL: $125.50</Typography>
                    </Skeleton>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Button>Save</Button>
                    <Button>Close Drawer</Button>
                    <Button>Collapse SideBar</Button>
                </Stack>
            </Stack>
        </SideBarSkeleton>
    );
};
