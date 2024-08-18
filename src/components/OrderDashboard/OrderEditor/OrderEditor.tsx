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
import { Order } from '../../../supabaseQueries';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

interface OrderEditorProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    order?: Order;
    asDialog?: boolean;
}

type FormValues = Order;

export const OrderEditor = ({ open, setOpen, order, asDialog }: OrderEditorProps) => {
    const { handleSubmit, register, control } = useForm<FormValues>({
        defaultValues: {
            order_number: null,
            order_type: 'delivery',
            phone: '',
            total_in_cents: 0,
        },
        values: order,
    });

    const body = (
        <Stack direction="column" spacing={2} mt={2}>
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
        console.log({ data });
        // this should be a mutation using react query
        setOpen(false);
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

    // add react hook form

    if (open) {
        return (
            <Stack direction="column" m={2}>
                <Typography variant="h5" textAlign={'center'}>
                    Order Editor
                </Typography>
                {body}
                <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
            </Stack>
        );
    }
};
