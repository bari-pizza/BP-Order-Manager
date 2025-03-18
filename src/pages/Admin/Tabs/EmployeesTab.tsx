import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import {
    useQueryClient,
    //  useSuspenseQuery
} from '@tanstack/react-query';
// import { getAllEmployees } from '../../../supabaseQueries';
import { EmployeesTable } from '../Tables/EmployeesTable';
import { Profile } from '../../../typesAndValidators';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { Controller, useForm } from 'react-hook-form';
import { supaClient } from '../../../supaClient';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { getEnv } from '../../../utils';
import { m } from 'framer-motion';

const sortEmployees = (a: Profile, b: Profile) => {
    const aFirstName = a.first_name?.toLowerCase() || '';
    const bFirstName = b.first_name?.toLowerCase() || '';
    const aLastName = a.last_name?.toLowerCase() || '';
    const bLastName = b.last_name?.toLowerCase() || '';
    const aIsDeleted = a.is_deleted || false;
    const bIsDeleted = b.is_deleted || false;

    if (aIsDeleted && !bIsDeleted) {
        return 1;
    }
    if (!aIsDeleted && bIsDeleted) {
        return -1;
    }

    if (aFirstName < bFirstName) {
        return -1;
    }
    if (aFirstName > bFirstName) {
        return 1;
    }
    if (aLastName < bLastName) {
        return -1;
    }
    if (aLastName > bLastName) {
        return 1;
    }
    return 0;
};

type FormValues = { email: string; first_name: string; last_name: string; phone: string };

export const EmployeesTab = () => {
    const { drivers } = useBariPizzaContext();
    const toastRef = useRef<Id>('');
    const { open, close, isOpen } = useDialogProps();
    const {
        handleSubmit,
        formState: { dirtyFields, errors, isSubmitting },
        control,
    } = useForm({
        defaultValues: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
        },
    });
    const queryClient = useQueryClient();

    const profiles = (queryClient.getQueryData(['profiles']) ?? []) as Profile[];
    const employees = profiles
        .map((employee) => {
            const driver = drivers.find((driver) => {
                return driver.driver.id === employee.id;
            });
            return {
                ...employee,
                is_driver: driver !== undefined,
            };
        })
        .sort(sortEmployees);

    const onSubmit = async (formData: FormValues) => {
        const { email, first_name, last_name, phone } = formData;

        toastRef.current = toast.loading(`${m.creating()} ${m.employee()}`);

        const { error } = await supaClient.functions.invoke('create-user', {
            body: { email, first_name, last_name, phone },
            headers: {
                Authorization: `Bearer ${getEnv('VITE_SUPABASE_ANON_KEY')}`,
            },
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
            // render: `Employee ${first_name} ${last_name} created successfully`,
            render: m.employeeCreatedSuccessfully(first_name, last_name),
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });

        close();
    };

    return (
        <Stack direction="column" alignItems={'center'} gap={2}>
            <EmployeesTable employees={employees} />
            <Button onClick={open} variant="contained">
                {m.addNewEmployee()}
            </Button>
            <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>{m.addEmployee()}</DialogTitle>
                <DialogContent>
                    <Stack direction="column" gap={2} mt={2}>
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: 'Email is required' }}
                            render={({ field }) => (
                                <SmartTextField
                                    {...field}
                                    label="Email"
                                    isDirty={dirtyFields.email}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="first_name"
                            rules={{ required: 'First Name is required' }}
                            render={({ field }) => (
                                <SmartTextField
                                    {...field}
                                    label="First Name"
                                    isDirty={dirtyFields.first_name}
                                    error={!!errors.first_name}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="last_name"
                            rules={{ required: 'Last Name is required' }}
                            render={({ field }) => (
                                <SmartTextField
                                    {...field}
                                    label="Last Name"
                                    isDirty={dirtyFields.last_name}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="phone"
                            rules={{ required: 'Phone is required' }}
                            render={({ field }) => (
                                <SmartTextField
                                    {...field}
                                    label="Phone"
                                    isDirty={dirtyFields.phone}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
