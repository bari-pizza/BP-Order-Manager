import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { OriginsTable } from '../Tables/OriginsTable';
import { Controller, useForm } from 'react-hook-form';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { useMemo, useRef, useState } from 'react';
import { Id, toast } from '../../../toast/toastWrapper';
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
    const [showDeleted, setShowDeleted] = useState(false);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isSubmitting },
    } = useForm<FormValues>({ defaultValues: { name: '' } });

    const onSubmit = async (data: FormValues) => {
        toastRef.current = toast.loading(`Adding origin: ${data.name}`);
        const { error } = await supaClient.from('OrderOrigin').insert({
            name: data.name,
            is_third_party: true,
        });
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

    const sortedOrigins = useMemo(() => {
        return [...origins]
            .filter((origin) => origin.is_third_party)
            .filter((origin) => showDeleted || !origin.is_deleted)
            .sort(sortOrigins);
    }, [origins, showDeleted]);

    const deletedCount = origins.filter((origin) => origin.is_third_party && origin.is_deleted).length;

    return (
        <Stack direction="column" alignItems={'center'} gap={2} height="100%">
            <Typography variant="body2" color="text.secondary" align="center" px={2}>
                Third-party platforms (DoorDash, Uber Eats, and so on). Bari Pizza is the in-house origin and is not
                listed here.
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={showDeleted}
                        onChange={(_, checked) => setShowDeleted(checked)}
                        color="primary"
                    />
                }
                label={deletedCount > 0 ? `Show deleted (${deletedCount})` : 'Show deleted'}
            />
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
                                    placeholder="Name"
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
