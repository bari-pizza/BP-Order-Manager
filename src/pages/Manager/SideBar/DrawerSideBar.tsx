import { Button, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useBariPizzaContext, useManagerDashboardContext } from '../../../hooks/data/useContextData';
import { SideBar, SideBarSkeleton } from '../../../components/SideBar';
import { DrawerCardBaseSkeleton, DrawerCardSlotProps } from '../../../components/Base/DrawerCardBase';
import { ContextMenu } from '../../../components/Base/ContextMenu';
import { DrawerCard } from '../DrawerCard';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldWithMask from '../../../rickcedlib/TextFieldWithMask';
import { MotionWrapper } from '../../../rickcedlib/MotionWrapper';
import { AnimatePresence } from 'framer-motion';
import { useBusinessDayDrawerSummaryCRUD } from '../../../api/businessDayDrawer';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { BusinessDayDrawerSummary } from '../../../typesAndValidators';
import { useEffect, useMemo } from 'react';

type FormValues = BusinessDayDrawerSummary;

export const DrawerSideBar = () => {
    const [businessDate] = useBusinessDate();
    const { constants } = useBariPizzaContext();
    const { orders, drawers } = useManagerDashboardContext();
    const currentDrawer = drawers.current;
    const currentDrawerID = currentDrawer?.drawer_id || '';
    const { businessDayDrawerSummaryMutations } = useBusinessDayDrawerSummaryCRUD({
        businessDate,
        drawerID: currentDrawerID,
    });
    const { data: summary } = businessDayDrawerSummaryMutations.getOne;

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
        formState: { errors },
        reset,
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
        businessDayDrawerSummaryMutations.upsert(data);
    };

    const drawersOrders = orders.byDrawerID(currentDrawer.drawer_id);
    const drawerSummary = {
        total_in_cents: 0,
        orders: 0,
        cash: 0,
        credit: 0,
    };
    drawersOrders.forEach((order) => {
        drawerSummary.total_in_cents += order.total_in_cents;
        drawerSummary.orders += 1;
        // driverSummary.cash += order.cash;
        // driverSummary.credit += order.credit;
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
                    <Typography variant="h6">ORDERS: {drawerSummary.orders}</Typography>
                    <Typography variant="h6">TOTAL: ${(drawerSummary.total_in_cents / 100).toFixed(2)}</Typography>
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
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                    <Button>Close Drawer</Button>
                    <Button onClick={() => drawers.onClick(drawers.current!)}>Collapse SideBar</Button>
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
