import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { useBariPizzaContext, useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { SideBar, SideBarSkeleton } from '../../../components/SideBar';
import { DrawerCardBaseSkeleton, DrawerCardSlotProps } from '../../../components/Base/DrawerCardBase';
import { ContextMenu } from '../../../components/Base/ContextMenu';
import { DrawerCard } from '../DrawerCard';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MotionWrapper } from '../../../rickcedlib/components/MotionWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { BusinessDayDrawerSummary } from '../../../typesAndValidators';
import {
    useEffect,
    useMemo,
    // useEffect, useMemo,
    useState,
} from 'react';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { SummaryDetails, SummaryStack, ThirdPartySummary } from './SummaryStack';
import { formatCurrency } from '../../../utils';
import { CashTransferEditor } from './CashTransferEditor';
import TextFieldWithMask from '../../../rickcedlib/components/TextFieldWithMask';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';

type FormValues = BusinessDayDrawerSummary;

export const DrawerSideBar = () => {
    const { open, close, isOpen } = useDialogProps();
    const { open: openCashTransfers, close: closeCashTransfers, isOpen: isOpenCashTransfers } = useDialogProps();
    const [businessDate] = useBusinessDate();
    const { constants } = useBariPizzaContext();
    const { orders, drawers, summaries, cashTransfers, drivers, businessDay } = useManagerDashboardContext();
    const [activeSummaryTab, setActiveSummaryTab] = useState(0);

    const [editableCashTransferID, setEditableCashTransferID] = useState<string | null>(null);

    const closeDialog = () => {
        close();
        setEditableCashTransferID(null);
    };

    // KEEP: if a driver is saved in localstorage, make sure they're currently working
    const currentDrawerExists =
        drawers.current?.drawer_type !== 'driver' ||
        drivers.todays.some((driver) => driver.drawer_id === drawers.current?.drawer_id);

    const currentDrawer = currentDrawerExists ? drawers.current : null;
    const currentDrawerID = currentDrawer?.drawer_id || '';
    const drawer1ID = drawers.all[0].drawer_id;
    const summary = summaries.byDrawerID(currentDrawerID);

    const transfers = cashTransfers.forCurrentDrawer;
    const bankTransfers = transfers.bank;
    const pmtTransfers = transfers.payment;
    const otherTransfers = transfers.other;
    const closingPmtTransfer = pmtTransfers.find((pmt) => pmt.title === 'Closing Payment');

    const defaultValues = useMemo(() => {
        return {
            business_date: businessDate.format('YYYY-MM-DD'),
            drawer_id: currentDrawer?.drawer_id,
            bank_in_cents:
                currentDrawer?.drawer_type === 'register'
                    ? summary?.bank_in_cents || constants.default.register_starting_cash_in_cents
                    : bankTransfers.reduce((acc, transfer) => acc + transfer.amount_in_cents, 0),
            hours: summary?.hours || 0,
            hours_in_cents: summary?.hours_in_cents || 0,
            other_in_cents: otherTransfers.reduce((acc, transfer) => acc + transfer.amount_in_cents, 0),
            is_locked: summary?.is_locked || false,
            special_note: summary?.special_note || '',
        };
    }, [
        businessDate,
        currentDrawer?.drawer_id,
        currentDrawer?.drawer_type,
        constants.default.register_starting_cash_in_cents,
        bankTransfers,
        summary?.hours,
        summary?.hours_in_cents,
        summary?.is_locked,
        summary?.bank_in_cents,
        summary?.special_note,
        otherTransfers,
    ]);

    const { handleSubmit, control, setValue, reset, watch } = useForm<FormValues>({
        defaultValues: summary || defaultValues,
    });

    useEffect(() => {
        if (currentDrawerID) {
            reset(defaultValues);
        }
    }, [reset, currentDrawerID, defaultValues]);

    if (!currentDrawer || currentDrawer.name === 'Unassigned') {
        return null;
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const hoursInCents = data.hours * constants.default.driver_hourly_wage_in_cents;
        const cleanedData = {
            ...data,
            drawer_id: currentDrawer.drawer_id,
            hours_in_cents: hoursInCents,
        };
        summaries.update(cleanedData);
    };

    const drawersOrders = orders.byDrawerID(currentDrawer.drawer_id);
    const drawerSummary = {
        bank_in_cents:
            currentDrawer?.drawer_type === 'register'
                ? // ? constants.default.register_starting_cash_in_cents
                  watch('bank_in_cents')
                : bankTransfers.reduce((acc, transfer) => acc + transfer.amount_in_cents, 0) || 0,
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
    const thirdPartySummary: ThirdPartySummary = {};
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
                if (order.origin_id in thirdPartySummary) {
                    thirdPartySummary[order.origin_id].total_in_cents += payment.amount_in_cents;
                } else {
                    thirdPartySummary[order.origin_id] = { total_in_cents: payment.amount_in_cents };
                }
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
        // Sync hours → hours_in_cents from the Hours field before opening Confirm,
        // so outstanding / closing payment use the same value that will be saved.
        handleSubmit((data) => {
            const hoursInCents = data.hours * constants.default.driver_hourly_wage_in_cents;
            setValue('hours_in_cents', hoursInCents, { shouldDirty: true });
            onSubmit({ ...data, hours_in_cents: hoursInCents });
            open();
        })();
    };

    const handleDrawerClosureClick = () => {
        drawers.close(currentDrawer);
        close();
    };

    const handleReopenDrawerClick = () => {
        drawers.reOpen(currentDrawer);
    };

    const total = drawerSummary.total_in_cents;
    const bank = drawerSummary.bank_in_cents;
    // Derive wage cents from Hours so outstanding never lags a stale hours_in_cents.
    const hours = (watch('hours') || 0) * constants.default.driver_hourly_wage_in_cents;
    const card = drawerSummary.card_in_cents + drawerSummary.card_tips_in_cents;
    const thirdParty = drawerSummary.third_party_in_cents + drawerSummary.third_party_tips_in_cents;
    const deliveryFees = drawerSummary.delivery_fees_in_cents;
    const other = otherTransfers.reduce(
        (acc, { amount_in_cents, source }) => (source === currentDrawer.drawer_id ? -1 : 1) * amount_in_cents + acc,
        0,
    );
    const payments = pmtTransfers.reduce(
        (acc, { amount_in_cents, source }) => (source === currentDrawer.drawer_id ? -1 : 1) * amount_in_cents + acc,
        0,
    );
    const items = [];
    const hungerRushItems = [];
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
                    details: `${(hours / constants.default.driver_hourly_wage_in_cents).toFixed(
                        2,
                    )} hours @ ${formatCurrency(constants.default.driver_hourly_wage_in_cents)}`,
                },
                {
                    label: 'Cards',
                    value: -card,
                    details: `${formatCurrency(drawerSummary.card_in_cents)} base | ${formatCurrency(
                        drawerSummary.card_tips_in_cents,
                    )} tips`,
                },
                {
                    label: '3rd Party',
                    value: -thirdParty,
                    details: `${formatCurrency(drawerSummary.third_party_in_cents)} base | ${formatCurrency(
                        drawerSummary.third_party_tips_in_cents,
                    )} tips`,
                },
                {
                    label: 'Deliveries',
                    value: -deliveryFees,
                    details: '$4 per order',
                },
                {
                    label: 'Other',
                    value: other,
                },
                {
                    label: 'Payments',
                    value: payments,
                    details: closingPmtTransfer
                        ? `Closing Payment Paid ${
                              closingPmtTransfer.source === currentDrawer.drawer_id ? 'By' : 'To'
                          } ${currentDrawer.name}: ${formatCurrency(closingPmtTransfer.amount_in_cents)}`
                        : 'No Closing Payment',
                },
            );
            hungerRushItems.push(
                {
                    label: 'Total',
                    value: total,
                },
                {
                    label: 'Bank',
                    value: bank,
                },
            );
            break;
        case 'register':
            items.push(
                {
                    label: 'Starting Cash',
                    value: bank,
                },
                {
                    label: 'Cash Orders',
                    value: total - card,
                },
                {
                    label: 'Card Orders',
                    value: card,
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

    // Outstanding already includes an existing Closing Payment in the Payments line.
    // Strip that contribution so Create/Edit always seeds the full correct amount
    // (not a stale snapshot from when the editor first mounted).
    const closingPaymentNeeded =
        outstandingAmount -
        (closingPmtTransfer
            ? closingPmtTransfer.amount_in_cents *
              (closingPmtTransfer.source === currentDrawer.drawer_id ? -1 : 1)
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
                                    <DrawerCard drawer={currentDrawer} sx={sx} props={props} canOpen={false} />
                                </MotionWrapper>
                            </ContextMenu.Base>
                            <DrawerCard.contextMenu drawer={currentDrawer} />
                        </ContextMenu>
                    </AnimatePresence>
                    {isLocked ? (
                        <>
                            {currentDrawer?.drawer_type === 'register' && (
                                <SummaryDetails
                                    items={items}
                                    drawerID={currentDrawer.drawer_id}
                                    transfers={[...bankTransfers, ...pmtTransfers, ...otherTransfers]}
                                    forSideBar
                                />
                            )}
                            {/* {isDriver && <SummaryStack items={items} />} */}
                            {(isDriver || currentDrawer.drawer_type === 'register') && (
                                <>
                                    {activeSummaryTab === 0 && <SummaryStack items={items} />}
                                    {activeSummaryTab === 1 && <SummaryStack items={hungerRushItems} />}

                                    <ButtonGroup>
                                        <Button
                                            onClick={() => setActiveSummaryTab(0)}
                                            variant={activeSummaryTab === 0 ? 'contained' : 'outlined'}>
                                            Closing Summary
                                        </Button>
                                        <Button
                                            onClick={() => setActiveSummaryTab(1)}
                                            variant={activeSummaryTab === 1 ? 'contained' : 'outlined'}>
                                            Hunger Rush
                                        </Button>
                                    </ButtonGroup>
                                </>
                            )}

                            {currentDrawer.drawer_type === 'third_party' && (
                                <ThirdPartySummary thirdPartySummary={thirdPartySummary} />
                            )}
                            <Button onClick={handleReopenDrawerClick} disabled={businessDay.isLocked}>
                                Reopen Drawer
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">ORDERS: {drawerSummary.orders}</Typography>
                            <Typography variant="h6">TOTAL: {formatCurrency(drawerSummary.total_in_cents)}</Typography>

                            {currentDrawer.drawer_type !== 'third_party' && (
                                <Button onClick={openCashTransfers}>Cash Transfers</Button>
                            )}
                            {/* {isDriver && <SmartTextFieldlabel="Hours" {...register('hours')} />} */}
                            {isDriver && (
                                <Controller
                                    name="hours"
                                    control={control}
                                    render={({ field: { onChange, value } }) => {
                                        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = Number(event.target.value);
                                            onChange(value);
                                            setValue(
                                                'hours_in_cents',
                                                value * constants.default.driver_hourly_wage_in_cents,
                                                { shouldDirty: true },
                                            );
                                        };

                                        return <SmartTextField label="Hours" value={value} onChange={handleChange} />;
                                    }}
                                />
                            )}
                            {currentDrawer.drawer_type === 'register' && (
                                <Controller
                                    name="bank_in_cents"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextFieldWithMask
                                            sx={{ minWidth: 100 }}
                                            label="Amount"
                                            maskVariant="currency"
                                            value={value}
                                            handleChange={(value, shouldDirty) =>
                                                setValue('bank_in_cents', value, { shouldDirty })
                                            }
                                        />
                                    )}
                                />
                            )}
                            <Button onClick={handleCloseDrawerClick}>Save & Close Drawer</Button>
                        </>
                    )}
                    <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Confirm Drawer Close</DialogTitle>
                        <DialogContent>
                            {isDriver && <SummaryStack items={items} />}
                            {currentDrawer?.drawer_type === 'register' && (
                                <SummaryDetails
                                    items={items}
                                    drawerID={currentDrawer.drawer_id}
                                    transfers={[...bankTransfers, ...pmtTransfers, ...otherTransfers]}
                                />
                            )}
                            {currentDrawer.drawer_type === 'third_party' && (
                                <ThirdPartySummary thirdPartySummary={thirdPartySummary} />
                            )}
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center' }}>
                            {isDriver && outstandingAmount !== 0 ? (
                                <>
                                    {editableCashTransferID === 'closing-cash-transfer' ? (
                                        closingPmtTransfer ? (
                                            <CashTransferEditor
                                                key={`closing-edit-${Math.abs(closingPaymentNeeded)}`}
                                                isEditing
                                                setIsEditing={(bool) =>
                                                    setEditableCashTransferID(bool ? 'closing-cash-transfer' : null)
                                                }
                                                drawerID={currentDrawer.drawer_id}
                                                cashTransfer={{
                                                    ...closingPmtTransfer,
                                                    amount_in_cents: Math.abs(closingPaymentNeeded),
                                                    source:
                                                        closingPaymentNeeded > 0
                                                            ? currentDrawer.drawer_id
                                                            : drawer1ID,
                                                    destination:
                                                        closingPaymentNeeded < 0
                                                            ? currentDrawer.drawer_id
                                                            : drawer1ID,
                                                }}
                                            />
                                        ) : (
                                            <CashTransferEditor
                                                key={`closing-new-${Math.abs(closingPaymentNeeded)}`}
                                                isEditing
                                                setIsEditing={(bool) =>
                                                    setEditableCashTransferID(bool ? 'closing-cash-transfer' : null)
                                                }
                                                forNewCashTransfer
                                                drawerID={currentDrawer.drawer_id}
                                                transferType="payment"
                                                definedValues={{
                                                    cashTransfer: {
                                                        amount_in_cents: Math.abs(closingPaymentNeeded),
                                                        source:
                                                            closingPaymentNeeded > 0
                                                                ? currentDrawer.drawer_id
                                                                : drawer1ID,
                                                        destination:
                                                            closingPaymentNeeded < 0
                                                                ? currentDrawer.drawer_id
                                                                : drawer1ID,
                                                        title: 'Closing Payment',
                                                    },
                                                    completedFirstStep: true,
                                                    toFromSpentReceived: closingPaymentNeeded < 0 ? 'from' : 'to',
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
                        <SmartTextField />
                    </Skeleton>
                    <Skeleton>
                        <SmartTextField />
                    </Skeleton>
                    <Skeleton>
                        <SmartTextField />
                    </Skeleton>
                    <Button>Save</Button>
                    <Button>Close Drawer</Button>
                </Stack>
            </Stack>
        </SideBarSkeleton>
    );
};
