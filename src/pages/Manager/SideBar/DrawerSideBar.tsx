import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldWithMask from '../../../rickcedlib/TextFieldWithMask';
import { MotionWrapper } from '../../../rickcedlib/MotionWrapper';
import { AnimatePresence } from 'framer-motion';
// import { useBusinessDayDrawerSummaryCRUD } from '../../../api/businessDayDrawer';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { BusinessDayDrawerSummary } from '../../../typesAndValidators';
import { Fragment, useEffect, useMemo } from 'react';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { getRunningTotal } from '../../../utils';

type FormValues = BusinessDayDrawerSummary;

export const DrawerSideBar = () => {
    const { open, close, isOpen } = useDialogProps();
    const [businessDate] = useBusinessDate();
    const { constants } = useBariPizzaContext();
    const { orders, drawers, summaries } = useManagerDashboardContext();
    const currentDrawer = drawers.current;
    const currentDrawerID = currentDrawer?.drawer_id || '';
    // const { businessDayDrawerSummaryMutations } = useBusinessDayDrawerSummaryCRUD({
    //     businessDate,
    //     drawerID: currentDrawerID,
    // });
    // const { data: summary } = businessDayDrawerSummaryMutations.getOne;
    const summary = summaries.byDrawerID(currentDrawerID);

    const defaultValues = useMemo(() => {
        return {
            bank_in_cents: constants.default.starting_cash_in_cents,
            hours: 0,
            hours_in_cents: 0,
            other_in_cents: 0,
            business_date: businessDate.format('YYYY-MM-DD'),
            drawer_id: currentDrawer?.drawer_id,
            is_closed: false,
            is_locked: false,
            special_note: '',
            ...summary,
        };
    }, [constants, currentDrawer, businessDate, summary]);

    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<FormValues>({
        defaultValues: summary || defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    if (!currentDrawer || currentDrawer.name === 'Unassigned') {
        return null;
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        const cleanedData = {
            ...data,
            hours_in_cents: data.hours * constants.default.driver_hourly_wage_in_cents,
        };
        summaries.update(cleanedData);
        // businessDayDrawerSummaryMutations.upsert(cleanedData);
    };

    const onClosure: SubmitHandler<FormValues> = (data) => {
        const cleanedData = {
            ...data,
            is_closed: true,
            is_locked: true,
        };
        summaries.update(cleanedData);
        // businessDayDrawerSummaryMutations.upsert(cleanedData);
    };

    const drawersOrders = orders.byDrawerID(currentDrawer.drawer_id);
    const drawerSummary = {
        total_in_cents: 0,
        orders: 0,
        cash_in_cents: 0,
        card_in_cents: 0,
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
        handleSubmit(onClosure)();
        close();
    };

    const total = drawerSummary.total_in_cents;
    const bank = watch('bank_in_cents');
    const hours = watch('hours_in_cents');
    const card = drawerSummary.card_in_cents + drawerSummary.card_tips_in_cents;
    const thirdParty = drawerSummary.third_party_in_cents + drawerSummary.third_party_tips_in_cents;
    const deliveryFees = drawerSummary.delivery_fees_in_cents;
    const other = watch('other_in_cents');
    const items = [
        {
            label: 'Total',
            value: total,
        },
        {
            label: '+ Bank',
            value: bank,
        },
        {
            label: '- Hours',
            value: -hours,
        },
        {
            label: '- Cards',
            value: -card,
        },
        {
            label: '- 3rd Party',
            value: -thirdParty,
        },
        {
            label: '- Deliveries',
            value: -deliveryFees,
        },
    ];
    const runningTotals = getRunningTotal([total, bank, -hours, -card, -thirdParty, -deliveryFees, -other]);

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
                    <Typography variant="h6">ORDERS: {drawerSummary.orders}</Typography>
                    <Typography variant="h6">TOTAL: ${(drawerSummary.total_in_cents / 100).toFixed(2)}</Typography>
                    {isDriver && (
                        <>
                            <Controller
                                name="bank_in_cents"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextFieldWithMask
                                        label="Bank"
                                        maskVariant="currency"
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors.bank_in_cents}
                                        helperText={errors.bank_in_cents?.message}
                                    />
                                )}
                            />
                            <TextField label="Hours" {...register('hours')} />
                            <Controller
                                name="other_in_cents"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextFieldWithMask
                                        label="Other"
                                        maskVariant="currency"
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors.other_in_cents}
                                        helperText={errors.other_in_cents?.message}
                                    />
                                )}
                            />
                            {isDirty && (
                                <AnimatePresence>
                                    <MotionWrapper motionProps={motionProps} motionKey="save">
                                        <Button onClick={handleSubmit(onSubmit)} variant="contained">
                                            Save Changes
                                        </Button>
                                    </MotionWrapper>
                                </AnimatePresence>
                            )}
                        </>
                    )}
                    <Button onClick={handleCloseDrawerClick}>Close Drawer</Button>
                    <Button onClick={() => drawers.onClick(drawers.current!)}>Collapse SideBar</Button>
                    <Dialog open={isOpen} onClose={close} fullWidth>
                        <DialogTitle>Confirm Drawer Close</DialogTitle>
                        <DialogContent>
                            <Stack direction="column" spacing={1} width="30%" margin="auto">
                                {items.map((item, index) => (
                                    <Fragment key={item.label}>
                                        <Stack direction="row" justifyContent="right" spacing={2}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {item.label}:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                ${(item.value / 100).toFixed(2)}
                                            </Typography>
                                        </Stack>
                                        {index > 0 && (
                                            <>
                                                <Divider />
                                                <Stack direction="row" justifyContent="right">
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: index === items.length - 1 ? 'bold' : '' }}>
                                                        ${(runningTotals[index] / 100).toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            </>
                                        )}
                                    </Fragment>
                                ))}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={close} variant="outlined" color="error">
                                Cancel
                            </Button>
                            <Button onClick={handleDrawerClosureClick} variant="contained">
                                Confirm Drawer Closure
                            </Button>
                        </DialogActions>
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
