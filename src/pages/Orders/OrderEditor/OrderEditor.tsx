import { Dialog, DialogTitle, DialogContent, Button, Stack, Typography, MenuItem, Divider } from '@mui/material';
import { createNewOrder, updateOrder } from '../../../supabaseQueries';
import {
    Drawer,
    Driver_Drawer,
    NewOrder,
    Order_Payment,
    OrderOrigin,
    OrderType,
    PaymentType,
    validators,
} from '../../../typesAndValidators';
import {
    useForm,
    Controller,
    SubmitHandler,
    SubmitErrorHandler,
    FieldErrors,
    UseFormHandleSubmit,
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PaymentEditor, PaymentTypeSelector } from './PaymentEditor';
import TextFieldWithMask from '../../../rickcedlib/components/TextFieldWithMask';
import { motion } from 'framer-motion';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { useSession } from '../../../hooks/data/useSession';
import { useDrivers } from '../../../hooks/data/useDrivers';

const isValidDrawer = (
    drawer: Drawer | null,
    is_third_party: boolean,
    order_type: OrderType,
    driverDrawerID?: string,
) => {
    if (!drawer) return true;
    const { drawer_type } = drawer;

    if (driverDrawerID) return drawer.drawer_id === driverDrawerID;

    if (order_type === 'delivery' && drawer_type === 'driver') {
        return true;
    }
    if (order_type === 'pickup') {
        if (is_third_party && drawer_type === 'third_party') {
            return true;
        }
        if (!is_third_party && drawer_type === 'register') {
            return true;
        }
    }
    return false;
};

const paymentTypes: { value: PaymentType; label: string }[] = [
    {
        value: 'cash',
        label: 'Cash',
    },
    { value: 'card', label: 'Card' },
    { value: 'third_party', label: '3rd Party' },
];

const isValidPaymentType = (paymentType?: PaymentType, origin?: OrderOrigin) => {
    if (!paymentType) return false;
    if (!origin) return true;
    const { is_prepaid_toggleable, default_is_prepaid, is_third_party } = origin;
    if (!is_third_party && paymentType === 'third_party') return false;
    if (is_third_party && !is_prepaid_toggleable) {
        if (default_is_prepaid !== (paymentType === 'third_party')) return false;
    }
    return true;
};

type OrderEditorProps = {
    close: () => void;
    isOpen: boolean;
    order?: Order_Payment;
    asDialog?: boolean;
    forNewOrder?: boolean;
    isRepeat: (nameOrNumber: number | string | null, isStatic?: boolean) => boolean;
    driverDrawerID?: string;
};

type FormValues =
    | Order_Payment
    | (NewOrder & {
          initial_payment_type: PaymentType;
      });

export const OrderEditor = ({
    close,
    isOpen,
    asDialog,
    order,
    driverDrawerID,
    isRepeat,
    forNewOrder = false,
}: OrderEditorProps) => {
    const [businessDate] = useBusinessDate();
    const { origins, drawers, constants } = useBariPizzaContext();
    const {
        drivers: { todays: todaysDrivers },
    } = useDrivers();
    const { profile } = useSession();
    const driverIsEditing = !!driverDrawerID;

    const defaultDeliveryFee = constants.default.delivery_fee_in_cents;
    const defaultNewOrder = useMemo(() => {
        return {
            business_date: businessDate.format('YYYY-MM-DD'),
            last_updated_by: profile?.id,
            origin_id: origins.find((o) => o.name === 'Bari Pizza')!.origin_id,
            order_number: null,
            order_name: null,
            order_type: 'delivery' as OrderType,
            phone: null,
            total_in_cents: 0,
            drawer_id: driverDrawerID || '', // if a driver is editing, they can only choose their own drawer
            delivery_fee_in_cents: defaultDeliveryFee,
            initial_payment_type: 'cash' as PaymentType,
        };
    }, [businessDate, origins, defaultDeliveryFee, driverDrawerID, profile]);
    const {
        handleSubmit,
        register,
        control,
        setError,
        formState: { errors, isDirty, dirtyFields },
        reset,
        watch,
        setValue,
    } = useForm<FormValues>({
        defaultValues: forNewOrder ? defaultNewOrder : order,
        reValidateMode: 'onChange',
    });

    // const queryClient = useQueryClient();

    const createNewOrderMutation = useMutation({
        mutationFn: createNewOrder,
        onSuccess: (data) => {
            console.log({ data });
            close();
            reset();
        },

        onError: (error) => {
            console.error('Issue creating new order', error);
            setError('root', { message: "Couldn't create new order" });
        },
    });

    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: (data) => {
            reset(data[0]);
        },
        onError: (error) => {
            console.error(`Issue updating order: "${order?.order_id}`, error);
            reset();
            setError('root', { message: "Couldn't update order" });
        },
    });

    // TODO: showing default driver but not adding them as drawer

    const drawersAndDrivers: (Drawer | Driver_Drawer)[] = [...drawers, ...todaysDrivers];

    const currentOrigin = origins.find((origin) => origin.origin_id === watch('origin_id'))!;
    const currentOrderName = watch('order_name');
    const currentOrderNumber = watch('order_number');
    const currentOrderType = watch('order_type');
    const currentDrawer = drawersAndDrivers.find((drawer) => drawer.drawer_id === watch('drawer_id')) || null;

    const { can_deliver, has_order_number, is_third_party } = currentOrigin;

    const validOrigins = driverDrawerID ? origins.filter((origin) => origin.can_deliver) : origins;

    const invalidOrderType = currentOrderType === 'delivery' && can_deliver === false;

    const validDrawers = drawersAndDrivers.filter((drawer) =>
        isValidDrawer(drawer, is_third_party, currentOrderType, driverDrawerID),
    );

    const invalidDrawer = !isValidDrawer(currentDrawer, is_third_party, currentOrderType, driverDrawerID);

    const validPaymentTypes = paymentTypes.filter(({ value }) => isValidPaymentType(value, currentOrigin));

    const invalidInitialPaymentType = !isValidPaymentType(watch('initial_payment_type'), currentOrigin);

    if (invalidDrawer) console.log({ currentDrawer, is_third_party, currentOrderType });

    useEffect(() => {
        if (order) {
            reset(order);
        } else {
            reset(defaultNewOrder);
        }
    }, [order, defaultNewOrder, reset]);

    useEffect(() => {
        if (invalidOrderType) {
            setValue('order_type', 'pickup');
        }
    }, [invalidOrderType, validDrawers, setValue]);

    useEffect(() => {
        if (invalidDrawer) {
            setValue('drawer_id', validDrawers.length === 1 ? validDrawers[0].drawer_id : '');
        }
    }, [invalidDrawer, validDrawers, setValue]);

    useEffect(() => {
        // initial payment type only exists on new orders
        if (forNewOrder && invalidInitialPaymentType) {
            setValue('initial_payment_type', validPaymentTypes[0].value);
        }
    }, [invalidInitialPaymentType, validPaymentTypes, forNewOrder, setValue]);

    useEffect(() => {
        if (currentOrderType === 'delivery') {
            setValue('delivery_fee_in_cents', defaultDeliveryFee);
        } else {
            setValue('delivery_fee_in_cents', 0);
        }
    }, [currentOrderType, defaultDeliveryFee, setValue]);

    useEffect(() => {
        // initial payment type only exists on new orders
        if (forNewOrder && currentOrigin) {
            const defaultPaymentType = currentOrigin.default_is_prepaid ? 'third_party' : 'cash';
            setValue('initial_payment_type', defaultPaymentType);
        }
    }, [currentOrigin, forNewOrder, setValue]);

    useEffect(() => {
        // if origin.has_order_number changes, reset the order_name/order_number field to null
        if (has_order_number) {
            setValue('order_name', null);
        } else {
            setValue('order_number', null);
        }
    }, [has_order_number, setValue]);

    const isLocked = order?.is_locked;

    const leftSide = (
        <>
            <Controller
                name="origin_id"
                control={control}
                render={({ field }) => {
                    return (
                        <SmartTextField
                            {...field}
                            autoFocus
                            label="Origin"
                            select
                            disabled={isLocked}
                            value={field.value}
                            isDirty={dirtyFields.origin_id}>
                            {validOrigins.map((origin) => (
                                <MenuItem key={origin.name} value={origin.origin_id}>
                                    {origin.name}
                                </MenuItem>
                            ))}
                        </SmartTextField>
                    );
                }}
            />
            <Controller
                name="order_type"
                control={control}
                render={({ field }) => {
                    const valueWithFallback = can_deliver ? field.value : 'pickup';
                    return (
                        <SmartTextField
                            {...field}
                            isDirty={dirtyFields.order_type}
                            label="Order Type"
                            select
                            disabled={isLocked || driverIsEditing}
                            value={valueWithFallback}
                            style={{ textTransform: 'capitalize' }}>
                            {can_deliver && <MenuItem value="delivery">Delivery</MenuItem>}
                            {!driverDrawerID && <MenuItem value="pickup">Pickup</MenuItem>}
                        </SmartTextField>
                    );
                }}
            />
            <Controller
                name="drawer_id"
                control={control}
                render={({ field }) => {
                    const currentDrawerID =
                        validDrawers.length === 1
                            ? validDrawers[0].drawer_id
                            : validDrawers.some((drawer) => drawer.drawer_id === field.value)
                              ? field.value
                              : '';

                    // console.log({ validDrawers, driverDrawerID, currentDrawerID, field });

                    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (['Delete', 'Backspace', 'Escape'].includes(event.key)) {
                            // Clear the value if Delete, Backspace, or Esc is pressed
                            field.onChange(''); // Set the value to empty
                        }
                    };

                    return (
                        <SmartTextField
                            {...field}
                            label="Drawer"
                            select
                            isDirty={dirtyFields.drawer_id}
                            value={currentDrawerID}
                            onKeyDown={handleKeyDown}
                            disabled={isLocked || driverIsEditing}>
                            {validDrawers.map((drawer) => {
                                return (
                                    <MenuItem key={drawer.name} value={drawer.drawer_id}>
                                        {drawer.name}
                                    </MenuItem>
                                );
                            })}
                        </SmartTextField>
                    );
                }}
            />
        </>
    );

    const nameAlreadyExists = isRepeat(currentOrderName, !dirtyFields.order_name) && 'Order name already exists';
    const numberAlreadyExists =
        isRepeat(currentOrderNumber, !dirtyFields.order_number) && 'Order number already exists';

    const rightSide = (
        <>
            {currentOrigin?.has_order_number ? (
                <SmartTextField
                    key="order_number"
                    label="Order Number"
                    {...register('order_number', {
                        ...validators.order.order_number,
                        // shouldUnregister: true,
                    })}
                    disabled={isLocked}
                    error={!!(errors.order_number || numberAlreadyExists)}
                    helperText={errors.order_number?.message || numberAlreadyExists}
                    isDirty={dirtyFields.order_number}
                />
            ) : (
                <SmartTextField
                    key="order_name"
                    label="Order Name"
                    {...register('order_name', {
                        required: !currentOrigin?.has_order_number && 'Required',
                    })}
                    disabled={isLocked}
                    error={!!(errors.order_name || nameAlreadyExists)}
                    helperText={errors.order_name?.message || nameAlreadyExists}
                    isDirty={dirtyFields.order_name}
                />
            )}
            {asDialog && (
                <Controller
                    name="delivery_fee_in_cents"
                    control={control}
                    // rules={validators.order.delivery_fee_in_cents}
                    render={({ field: { value } }) => {
                        return (
                            <TextFieldWithMask
                                label="Delivery Fee"
                                maskVariant="currency"
                                error={!!errors.delivery_fee_in_cents}
                                helperText={errors.delivery_fee_in_cents?.message}
                                value={value}
                                disabled={isLocked || currentOrderType !== 'delivery' || driverIsEditing}
                                handleChange={(value, shouldDirty) =>
                                    setValue('delivery_fee_in_cents', value, { shouldDirty })
                                }
                                isDirty={dirtyFields.delivery_fee_in_cents}
                            />
                        );
                    }}
                />
            )}
            <Controller
                name="total_in_cents"
                control={control}
                rules={validators.order.total_in_cents}
                render={({ field: { value } }) => {
                    return (
                        <TextFieldWithMask
                            label="Total"
                            maskVariant="currency"
                            disabled={isLocked}
                            error={!!errors.total_in_cents}
                            helperText={errors.total_in_cents?.message}
                            value={value}
                            handleChange={(value, shouldDirty) => setValue('total_in_cents', value, { shouldDirty })}
                            isDirty={dirtyFields.total_in_cents}
                        />
                    );
                }}
            />
        </>
    );

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        data.drawer_id = data.drawer_id || null; // can't be ''
        data.last_updated_by = profile?.id || null;
        if ('order_id' in data) {
            updateOrderMutation.mutate(data);
        } else {
            createNewOrderMutation.mutate({ newOrder: data });
        }
    };

    const onError: SubmitErrorHandler<FieldErrors> = (fields) => {
        console.log({ fields, errors, currentOrderName, currentOrderNumber });
        console.error('Invalid form submission');
    };

    const handleCancel = () => {
        close();
        if (order) {
            reset(order);
        } else {
            reset();
        }
    };

    if (asDialog) {
        return (
            <OrderEditorDialog
                isOpen={isOpen}
                close={handleCancel}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onError={onError}
                leftSide={leftSide}
                rightSide={rightSide}
                errors={errors}
                order={order!}
                isDirty={isDirty}
                validPaymentTypes={validPaymentTypes}
            />
        );
    }

    if (isOpen) {
        return (
            <Stack direction="column" m={2}>
                <Typography variant="h5" textAlign={'center'}>
                    Order Editor
                </Typography>
                <Stack direction="column" spacing={2} mt={2} mb={2}>
                    {errors.root && <Typography color="error">{errors.root.message}</Typography>}
                    {leftSide}
                    {rightSide}
                    <PaymentTypeSelector
                        control={control}
                        validPaymentTypes={validPaymentTypes}
                        handleChange={(paymentType) => {
                            setValue('initial_payment_type', paymentType);
                        }}
                        name="initial_payment_type"
                    />
                </Stack>
                <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Stack>
        );
    }
};

const OrderEditorDialog = ({
    isOpen,
    close,
    leftSide,
    rightSide,
    errors,
    isDirty,
    handleSubmit,
    onSubmit,
    onError,
    order,
    validPaymentTypes,
}: {
    isOpen: boolean;
    close: () => void;
    leftSide: ReactNode;
    rightSide: ReactNode;
    errors: FieldErrors;
    isDirty: boolean;
    handleSubmit: UseFormHandleSubmit<FormValues>;
    onSubmit: SubmitHandler<FormValues>;
    onError: SubmitErrorHandler<FieldErrors>;
    order: Order_Payment;
    validPaymentTypes: { value: PaymentType; label: string }[];
}) => {
    const [editablePaymentID, setEditablePaymentID] = useState<string | null>(null);
    const payments = order.payments?.sort((a, b) => b.created_at.localeCompare(a.created_at)) || [];

    const paymentsTotalInCents = payments.reduce((total, payment) => total + payment.amount_in_cents, 0);
    const missingPaymentInCents = order.total_in_cents - paymentsTotalInCents;

    const activePayment = editablePaymentID
        ? payments?.find((payment) => payment.payment_id === editablePaymentID)
        : null;

    const isLocked = order.is_locked;

    const activePaymentEditor = editablePaymentID ? (
        editablePaymentID === 'newPayment' ? (
            <PaymentEditor
                forNewPayment
                key="newPayment"
                orderID={order.order_id}
                validPaymentTypes={validPaymentTypes}
                variant="icon"
                defaultAmount={missingPaymentInCents}
                isEditing={true}
                setIsEditing={(bool) => setEditablePaymentID(bool ? 'newPayment' : null)}
            />
        ) : (
            <PaymentEditor
                key={activePayment!.payment_id}
                payment={activePayment!}
                variant="icon"
                validPaymentTypes={validPaymentTypes}
                isEditing={editablePaymentID === activePayment!.payment_id}
                setIsEditing={(bool) => setEditablePaymentID(bool ? activePayment!.payment_id : null)}
            />
        )
    ) : null;

    const handleClose = () => {
        close();
        setEditablePaymentID(null);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Order Editor</DialogTitle>
            <DialogContent sx={{ minHeight: 250 }}>
                {!editablePaymentID ? (
                    <Stack direction="column" spacing={2} mt={2}>
                        <Stack direction="row" spacing={2} mt={2} width="100%">
                            {errors.root && <Typography color="error">{errors.root.message}</Typography>}
                            <Stack direction="column" width="50%" spacing={2} mt={2}>
                                {leftSide}
                            </Stack>
                            <Stack direction="column" width="50%" spacing={2} mt={2}>
                                {rightSide}
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-around" width="100%">
                            <Button onClick={handleClose} disabled={!isDirty} color="error">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit(onSubmit, onError)} disabled={!isDirty}>
                                Save Changes
                            </Button>
                        </Stack>

                        <Divider />
                        {payments
                            .sort((a, b) => a.created_at.localeCompare(b.created_at))
                            .map((payment) => (
                                <motion.div key={payment.payment_id} whileHover={{ scale: 1.05 }}>
                                    <PaymentEditor
                                        key={payment.payment_id}
                                        payment={payment}
                                        validPaymentTypes={validPaymentTypes}
                                        isEditing={editablePaymentID === payment.payment_id}
                                        setIsEditing={(bool) => setEditablePaymentID(bool ? payment.payment_id : null)}
                                        disabled={isLocked}
                                    />
                                </motion.div>
                            ))}
                        <PaymentEditor
                            forNewPayment
                            key="newPayment"
                            orderID={order.order_id}
                            validPaymentTypes={validPaymentTypes}
                            defaultAmount={missingPaymentInCents}
                            isEditing={editablePaymentID === 'newPayment'}
                            setIsEditing={(bool) => setEditablePaymentID(bool ? 'newPayment' : null)}
                            disabled={isLocked}
                        />
                    </Stack>
                ) : (
                    activePaymentEditor
                )}
            </DialogContent>
        </Dialog>
    );
};
