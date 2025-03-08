import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { OriginsTable } from '../Tables/OriginsTable';
import { Controller, useForm } from 'react-hook-form';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { OrderOrigin } from '../../../typesAndValidators';
import { supaClient } from '../../../supaClient';

type FormValues = { name: string };

const sortOrigins = (a: OrderOrigin, b: OrderOrigin) => {
    const aName = a.name?.toLowerCase() || '';
    const bName = b.name?.toLowerCase() || '';
    const aIsDeleted = a.is_deleted || false;
    const bIsDeleted = b.is_deleted || false;

    if (aIsDeleted && !bIsDeleted) {
        return 1;
    }
    if (!aIsDeleted && bIsDeleted) {
        return -1;
    }

    if (aName < bName) {
        return -1;
    }

    if (aName > bName) {
        return 1;
    }

    return 0;
};

export const OriginsTab = () => {
    const toastRef = useRef<Id>('');
    const { origins } = useBariPizzaContext();
    const { isOpen, open, close } = useDialogProps();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isSubmitting },
    } = useForm<FormValues>({ defaultValues: { name: '' } });

    const onSubmit = async (data: FormValues) => {
        console.log(data);
        toastRef.current = toast.loading('Adding new origin...');
        const { error } = await supaClient.from('OrderOrigin').insert({ name: data.name });
        if (error) {
            toast.update(toastRef.current, {
                render: error.message,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            return;
        }
        toast.update(toastRef.current, {
            render: `Origin ${data.name} added successfully`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
        reset();
        close();
    };

    const sortedOrigins = [...origins].sort(sortOrigins);

    return (
        <Stack direction="column" alignItems={'center'} gap={2}>
            <OriginsTable origins={sortedOrigins} />
            <Button onClick={open} variant="contained">
                Add New Order Origin
            </Button>
            <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xs">
                <DialogTitle>Add New Order Origin</DialogTitle>
                <DialogContent>
                    <Stack direction="column" gap={2} mt={2}>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <SmartTextField
                                    {...field}
                                    label="Name"
                                    placeholder="New Origin"
                                    isDirty={dirtyFields.name}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
