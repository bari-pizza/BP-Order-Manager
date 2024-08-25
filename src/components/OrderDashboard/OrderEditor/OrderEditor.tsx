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
import { Order, createNewOrder, updateOrder } from '../../../supabaseQueries';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
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
    } = useForm<FormValues>({
        defaultValues: {
            order_number: null,
            order_type: 'delivery',
            phone: '',
            total_in_cents: 0,
            business_date: businessDate.format('YYYY-MM-DD'),
        },
        values: order,
    });

    const createNewOrderMutation = useMutation({
        mutationFn: createNewOrder,
        onSuccess: (data) => {
            console.log({ data });
            setOpen(false);
        },

        onError: (error) => {
            console.log('there was an oopsie!');
            setError('root', { message: error.message });
        },
    });

    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: (data) => {
            console.log({ data });
            setOpen(false);
        },
        onError: (error) => {
            console.log('there was an oopsie!');
            setError('root', { message: error.message });
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
            <TextField label="Order Number" {...register('order_number')} />
            <TextField label="Phone" {...register('phone')} />
            <TextField label="Total" {...register('total_in_cents')} />
        </Stack>
    );

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log('onSubmit');
        // this should be a mutation using react query
        if (order) {
            updateOrderMutation.mutate(data);
        } else {
            createNewOrderMutation.mutate(data);
        }
    };

    if (asDialog) {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Order Editor</DialogTitle>
                <DialogContent>{body}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
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
                <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </Stack>
        );
    }
};
