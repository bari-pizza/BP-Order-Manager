import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Divider,
} from '@mui/material';
import { createNewOrder, updateOrder } from '../../../supabaseQueries';
import {
    Drawer,
    Driver_Drawer,
    NewOrder,
    Order_Payment,
    OrderOrigin,
    OrderType,
    Payment,
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PaymentEditor, PaymentTypeSelector } from './PaymentEditor';

const isValidDrawer = (drawer: Drawer | null, is_third_party: boolean, order_type: OrderType) => {
    if (!drawer) return true;
    const { drawer_type } = drawer;

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

const initialPaymentOptions: { value: PaymentType; label: string }[] = [
    {
        value: 'cash',
        label: 'Cash',
    },
    { value: 'card', label: 'Card' },
    { value: 'third_party', label: '3rd Party' },
];

const isValidInitialPaymentType = (paymentType?: PaymentType, origin?: OrderOrigin) => {
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
};

type FormValues =
    | Order_Payment
    | (NewOrder & {
          initial_payment_type: PaymentType;
      });

export const OrderEditor = ({ close, isOpen, asDialog, order, forNewOrder = false }: OrderEditorProps) => {
    const [businessDate] = useBusinessDate();
    const { origins, drawers, drivers } = useBariPizzaContext();
    const defaultNewOrder = useMemo(() => {
        return {
            business_date: businessDate.format('YYYY-MM-DD'),
            origin_id: origins.find((o) => o.name === 'Bari Pizza')!.origin_id,
            order_number: null,
            order_name: null,
            order_type: 'delivery' as OrderType,
            phone: null,
            total_in_cents: 0,
            drawer_id: '',
            initial_payment_type: 'cash' as PaymentType,
        };
    }, [businessDate, origins]);
    const {
        handleSubmit,
        register,
        control,
        setError,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormValues>({
        defaultValues: forNewOrder ? defaultNewOrder : order,
        reValidateMode: 'onChange',
    });

    const queryClient = useQueryClient();

    const createNewOrderMutation = useMutation({
        mutationFn: createNewOrder,
        onSuccess: (data) => {
            console.log({ data });
            close();
            queryClient.invalidateQueries({ queryKey: ['orders', data[0].business_date] });
        },

        onError: (error) => {
            console.error('Issue creating new order', error);
            setError('root', { message: "Couldn't create new order" });
        },
    });

    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: (data) => {
            close();
            queryClient.invalidateQueries({ queryKey: ['orders', data[0].business_date] });
        },
        onError: (error) => {
            console.error(`Issue updating order: "${order?.order_id}`, error);
            setError('root', { message: "Couldn't update order" });
        },
    });

    const drawersAndDrivers: (Drawer | Driver_Drawer)[] = [...drawers, ...drivers];

    const currentOrigin = origins.find((origin) => origin.origin_id === watch('origin_id'))!;
    const currentOrderName = watch('order_name');
    const currentOrderNumber = watch('order_number');
    const currentOrderType = watch('order_type');
    const currentDrawer = drawersAndDrivers.find((drawer) => drawer.drawer_id === watch('drawer_id')) || null;

    const { can_deliver, has_order_number, is_third_party } = currentOrigin;

    const invalidOrderType = currentOrderType === 'delivery' && can_deliver === false;

    const validDrawers = drawersAndDrivers.filter((drawer) => isValidDrawer(drawer, is_third_party, currentOrderType));

    const invalidDrawer = !isValidDrawer(currentDrawer, is_third_party, currentOrderType);

    const validInitialPaymentTypes = initialPaymentOptions.filter(({ value }) =>
        isValidInitialPaymentType(value, currentOrigin),
    );

    const invalidInitialPaymentType = !isValidInitialPaymentType(watch('initial_payment_type'), currentOrigin);

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
            setValue('initial_payment_type', validInitialPaymentTypes[0].value);
        }
    }, [invalidInitialPaymentType, validInitialPaymentTypes, forNewOrder, setValue]);

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

    const leftSide = (
        <>
            <Controller
                name="origin_id"
                control={control}
                render={({ field }) => {
                    return (
                        <TextField {...field} label="Origin" select value={field.value}>
                            {origins.map((origin) => (
                                <MenuItem key={origin.name} value={origin.origin_id}>
                                    {origin.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    );
                }}
            />
            <Controller
                name="order_type"
                control={control}
                render={({ field }) => {
                    const valueWithFallback = can_deliver ? field.value : 'pickup';
                    return (
                        <TextField
                            {...field}
                            label="Order Type"
                            select
                            value={valueWithFallback}
                            style={{ textTransform: 'capitalize' }}>
                            {can_deliver && <MenuItem value="delivery">Delivery</MenuItem>}
                            <MenuItem value="pickup">Pickup</MenuItem>
                        </TextField>
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

                    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (['Delete', 'Backspace', 'Escape'].includes(event.key)) {
                            // Clear the value if Delete, Backspace, or Esc is pressed
                            field.onChange(''); // Set the value to empty
                        }
                    };

                    return (
                        <TextField {...field} label="Drawer" select value={currentDrawerID} onKeyDown={handleKeyDown}>
                            {validDrawers.map((drawer) => {
                                return (
                                    <MenuItem key={drawer.name} value={drawer.drawer_id}>
                                        {drawer.name}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    );
                }}
            />
        </>
    );

    const rightSide = (
        <>
            {currentOrigin?.has_order_number ? (
                <TextField
                    key="order_number"
                    label="Order Number"
                    {...register(
                        'order_number',
                        currentOrigin?.has_order_number && {
                            ...validators.order.order_number,
                        },
                    )}
                    error={!!errors.order_number}
                    helperText={errors.order_number?.message}
                />
            ) : (
                <TextField
                    key="order_name"
                    label="Order Name"
                    {...register('order_name', {
                        required: !currentOrigin?.has_order_number && 'Required',
                    })}
                    error={!!errors.order_name}
                    helperText={errors.order_name?.message}
                />
            )}
            <TextField
                label="Phone"
                {...register('phone', {
                    ...validators.order.phone,
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
            />
            <TextField
                label="Total"
                {...register('total_in_cents', {
                    ...validators.order.total_in_cents,
                })}
                error={!!errors.total_in_cents}
                helperText={errors.total_in_cents?.message}
            />
        </>
    );

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        data.drawer_id = data.drawer_id || null; // can't be ''
        if ('order_id' in data) {
            console.log({ data });
            updateOrderMutation.mutate(data);
        } else {
            // const { initial_payment_type: initialPaymentType, ...newOrder } = data;
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
                close={close}
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onError={onError}
                leftSide={leftSide}
                rightSide={rightSide}
                errors={errors}
                orderID={order?.order_id || ''}
                payments={order?.payments || []}
            />
        );
    }

    if (isOpen) {
        return (
            <Stack direction="column" m={2}>
                <Typography variant="h5" textAlign={'center'}>
                    Order Editor
                </Typography>
                <Stack direction="column" spacing={2} mt={2}>
                    {errors.root && <Typography color="error">{errors.root.message}</Typography>}
                    {leftSide}
                    {rightSide}
                    <PaymentTypeSelector
                        control={control}
                        validPaymentTypes={initialPaymentOptions}
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
    handleSubmit,
    onSubmit,
    onError,
    handleCancel,
    payments,
    orderID,
}: {
    isOpen: boolean;
    close: () => void;
    leftSide: ReactNode;
    rightSide: ReactNode;
    errors: FieldErrors;
    handleSubmit: UseFormHandleSubmit<FormValues>;
    onSubmit: SubmitHandler<FormValues>;
    onError: SubmitErrorHandler<FieldErrors>;
    handleCancel: () => void;
    payments: Payment[];
    orderID: string;
}) => {
    const [isPaymentsVisible, setIsPaymentsVisible] = useState(false);

    // Define sliding variants
    const slideVariants = {
        hidden: { opacity: 0, y: '100%' },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '100%' },
    };

    const toggleSection = () => {
        setIsPaymentsVisible(!isPaymentsVisible);
    };
    return (
        <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{isPaymentsVisible ? 'Payments List' : 'Order Editor'}</DialogTitle>
            <DialogContent sx={{ height: 300, overflowY: 'hidden' }}>
                {/* TODO: change overflowY back to normal but just hide scrollbar */}
                <AnimatePresence initial={false} mode="wait">
                    {!isPaymentsVisible ? (
                        <motion.div
                            key="editor"
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
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
                                <Divider />
                                <Typography
                                    variant="h5"
                                    textAlign={'center'}
                                    onClick={toggleSection}
                                    style={{ cursor: 'pointer' }}>
                                    Payments
                                </Typography>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payments"
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <Stack direction="column" spacing={2} mt={2}>
                                {payments.map((payment) => (
                                    <PaymentEditor key={payment.payment_id} payment={payment} variant="icon" />
                                ))}
                                <Divider />
                                <PaymentEditor forNewPayment orderID={orderID} />
                            </Stack>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
            <DialogActions>
                {isPaymentsVisible ? (
                    <Button onClick={toggleSection}>Go Back</Button>
                ) : (
                    <>
                        <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};
