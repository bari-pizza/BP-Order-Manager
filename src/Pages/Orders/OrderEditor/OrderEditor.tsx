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
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { createNewOrder, updateOrder } from '../../../supabaseQueries';
import { Order, validators } from '../../../typesAndValidators';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { useEffect } from 'react';

interface OrderEditorProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    order?: Order;
    asDialog?: boolean;
}

type FormValues = Order & {
    is_prepaid?: boolean;
};

export const OrderEditor = ({ open, setOpen, order, asDialog }: OrderEditorProps) => {
    const [businessDate] = useBusinessDate();
    const { origins } = useBariPizzaContext();
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
        defaultValues: {
            origin: 'Bari Pizza',
            order_number: null,
            order_name: null,
            order_type: 'delivery',
            is_prepaid: false,
            phone: null,
            total_in_cents: 0,
            drawer_id: null,
        },
        values: order,
        reValidateMode: 'onChange',
    });

    const queryClient = useQueryClient();

    const createNewOrderMutation = useMutation({
        mutationFn: createNewOrder,
        onSuccess: (data) => {
            console.log({ data });
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['orders', data?.business_date] });
        },

        onError: (error) => {
            console.error('Issue creating new order', error);
            setError('root', { message: "Couldn't create new order" });
        },
    });

    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: (data) => {
            console.log({ data });
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['orders', data?.business_date] });
        },
        onError: (error) => {
            console.error(`Issue updating order: "${order?.order_id}`, error);
            setError('root', { message: "Couldn't update order" });
        },
    });

    const currentOrigin = origins.find((origin) => origin.name === watch('origin'));
    const currentOrderName = watch('order_name');
    const currentOrderNumber = watch('order_number');
    const currentIsPrepaid = watch('is_prepaid');
    const currentOrderType = watch('order_type');

    const { can_deliver, has_order_number } = currentOrigin || {};

    const invalidOrderType = currentOrderType === 'delivery' && can_deliver === false;

    useEffect(() => {
        if (invalidOrderType) {
            setValue('order_type', 'pickup');
        }
    }, [invalidOrderType, setValue]);

    useEffect(() => {
        // if origin changes, reset the is_prepaid checkbox to the origin's default value
        if (currentOrigin) {
            setValue('is_prepaid', currentOrigin.default_is_prepaid);
        }
    }, [currentOrigin, setValue]);

    useEffect(() => {
        // if origin.has_order_number changes, reset the order_name/order_number field to null
        if (has_order_number) {
            setValue('order_name', null);
        } else {
            setValue('order_number', null);
        }
    }, [has_order_number, setValue]);

    const body = (
        <Stack direction="column" spacing={2} mt={2}>
            {errors.root && <Typography color="error">{errors.root.message}</Typography>}
            <Controller
                name="origin"
                control={control}
                render={({ field }) => {
                    return (
                        <TextField {...field} label="Origin" select value={field.value}>
                            {origins.map((origin) => (
                                <MenuItem key={origin.name} value={origin.name}>
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
            {currentOrigin?.is_prepaid_toggleable && (
                <Controller
                    name="is_prepaid"
                    control={control}
                    render={({ field }) => {
                        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            setValue('is_prepaid', event.target.checked);
                        };

                        return (
                            <FormControlLabel
                                sx={{ justifyContent: 'center' }}
                                control={<Checkbox {...field} checked={!!currentIsPrepaid} onChange={handleChange} />}
                                label="Is Prepaid"
                            />
                        );
                    }}
                />
            )}
            <TextField
                label="Total"
                {...register('total_in_cents', {
                    ...validators.order.total_in_cents,
                })}
                error={!!errors.total_in_cents}
                helperText={errors.total_in_cents?.message}
            />
        </Stack>
    );

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (order) {
            updateOrderMutation.mutate(data);
        } else {
            data.business_date = businessDate.format('YYYY-MM-DD');
            createNewOrderMutation.mutate(data);
        }
    };

    const onError: SubmitErrorHandler<FieldErrors> = (fields) => {
        console.log({ fields, errors, currentOrderName, currentOrderNumber });
        console.error('Invalid form submission');
    };

    const handleCancel = () => {
        setOpen(false);
        if (order) {
            reset(order);
        } else {
            reset();
        }
    };

    if (asDialog) {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Order Editor</DialogTitle>
                <DialogContent>{body}</DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (open) {
        return (
            <Stack direction="column" m={2}>
                <Typography variant="h5" textAlign={'center'}>
                    Order Editor
                </Typography>
                {body}
                <Button onClick={handleSubmit(onSubmit, onError)}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Stack>
        );
    }
};
