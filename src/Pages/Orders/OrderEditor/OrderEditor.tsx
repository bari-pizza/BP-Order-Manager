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
    ButtonGroup,
} from '@mui/material';
import { createNewOrder, updateOrder } from '../../../supabaseQueries';
import {
    Drawer,
    Driver_Drawer,
    NewOrder,
    Order,
    Order_Payment,
    OrderOrigin,
    OrderType,
    PaymentType,
    validators,
} from '../../../typesAndValidators';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { useEffect, useMemo } from 'react';

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

// interface OrderEditorProps {
//     close: () => void;
//     isOpen: boolean;
//     // order?: Order_Payment;
//     order?: Order;
//     asDialog?: boolean;
// }

type OrderEditorProps = {
    close: () => void;
    isOpen: boolean;
    order?: Order;
    asDialog?: boolean;
    forNewOrder?: boolean;
};

type FormValues =
    | Order_Payment
    | (NewOrder & {
          initial_payment_type?: PaymentType;
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
        // defaultValues: {
        //     origin_id: origins.find((o) => o.name === 'Bari Pizza')!.origin_id,
        //     order_number: null,
        //     order_name: null,
        //     order_type: 'delivery',
        //     phone: null,
        //     total_in_cents: 0,
        //     drawer_id: '',
        //     initial_payment_type: 'cash',
        // },
        defaultValues: forNewOrder ? defaultNewOrder : order,
        // values: order || defaultNewOrder,
        reValidateMode: 'onChange',
    });

    if (isOpen) {
        console.log({ order });
    }

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

    // TODO: figure out how to include unassigned as an option

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

    const initialPaymentSelector = (
        <Controller
            name="initial_payment_type"
            control={control}
            render={({ field }) => {
                return (
                    <ButtonGroup
                        orientation="horizontal"
                        fullWidth
                        color="primary"
                        sx={{ width: '100%' }}
                        aria-label="Payment Type"
                        {...field}>
                        {validInitialPaymentTypes.map((option) => {
                            const isSelected = option.value === field.value;
                            return (
                                <Button
                                    key={option.value}
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    onClick={() => {
                                        setValue('initial_payment_type', option.value);
                                    }}>
                                    {option.label}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                );
            }}
        />
    );

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        data.drawer_id = data.drawer_id || null; // can't be ''
        if ('order_id' in data) {
            console.log({ data });
            updateOrderMutation.mutate(data);
        } else {
            const { initial_payment_type: initialPaymentType, ...newOrder } = data;
            createNewOrderMutation.mutate({ newOrder, initialPaymentType });
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
            <Dialog open={isOpen} onClose={close}>
                <DialogTitle>Order Editor</DialogTitle>
                <DialogContent>
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
                        <Typography variant="h5" textAlign={'center'}>
                            Payments
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
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
                    {initialPaymentSelector}
                </Stack>
                <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Stack>
        );
    }
};
