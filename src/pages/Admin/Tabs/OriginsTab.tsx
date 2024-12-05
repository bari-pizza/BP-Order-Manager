import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { OriginsTable } from '../Tables/OriginsTable';
import { Controller, useForm } from 'react-hook-form';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

type FormValues = { name: string };

export const OriginsTab = () => {
    const toastRef = useRef<Id>('');
    const { origins } = useBariPizzaContext();
    const { isOpen, open, close } = useDialogProps();
    const {
        control,
        handleSubmit,
        formState: { errors, dirtyFields, isSubmitting },
    } = useForm<FormValues>({ defaultValues: { name: '' } });

    const onSubmit = async (data: FormValues) => {
        console.log(data);
        toastRef.current = toast.loading('Adding new origin...');
        close();
        await new Promise(() => {
            setTimeout(() => {
                toast.update(toastRef.current, {
                    render: "This hasn't been implemented yet",
                    type: 'info',
                    isLoading: false,
                    autoClose: 5000,
                });
            }, 1000);
        });
    };

    return (
        <Stack direction="column" alignItems={'center'} gap={2}>
            <OriginsTable origins={origins} />
            <Button onClick={open} variant="contained">
                Add New Order Origin
            </Button>
            <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>Add Employee</DialogTitle>
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
