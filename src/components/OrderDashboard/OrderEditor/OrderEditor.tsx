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
} from '@mui/material';
import { createNewOrder, updateOrder } from '../../../supabaseQueries';
import { Order, validators } from '../../../typesAndValidators';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessDate } from '../../../dataHooks/useBusinessDate';

interface OrderEditorProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    order?: Order;
    asDialog?: boolean;
}

type FormValues = Order;

export const OrderEditor = ({ open, setOpen, order, asDialog }: OrderEditorProps) => {
    const [businessDate] = useBusinessDate();
    const {
        handleSubmit,
        register,
        control,
        setError,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            order_number: null,
            order_type: 'delivery',
            phone: null,
            total_in_cents: 0,
            business_date: businessDate.format('YYYY-MM-DD'),
            drawer_id: null,
        },
        values: order,
        reValidateMode: 'onBlur',
        // resolver: order ? zodResolver(orderSchema) : zodResolver(newOrderSchema),
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

    const body = (
        <Stack direction="column" spacing={2} mt={2}>
            {errors.root && <Typography color="error">{errors.root.message}</Typography>}
            <Controller
                name="order_type"
                control={control}
                render={({ field }) => (
                    <TextField {...field} label="Order Type" select value={field.value}>
                        <MenuItem value="delivery">Delivery</MenuItem>
                        <MenuItem value="pickup">Pickup</MenuItem>
                    </TextField>
                )}
            />
            <TextField
                label="Order Number"
                {...register('order_number', {
                    ...validators.order.order_number,
                })}
                error={!!errors.order_number}
                helperText={errors.order_number?.message}
            />
            <TextField label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
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
        console.log({ data });
        if (order) {
            updateOrderMutation.mutate(data);
        } else {
            createNewOrderMutation.mutate(data);
        }
    };

    const onError: SubmitErrorHandler<FieldErrors> = (fields) => {
        console.log({ fields });
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
