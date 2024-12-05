import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getAllEmployees } from '../../../supabaseQueries';
import { EmployeesTable } from '../Tables/EmployeesTable';
import { Profile } from '../../../typesAndValidators';
import { useDialogProps } from '../../../hooks/ui/useDialogProps';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { Controller, useForm } from 'react-hook-form';
import { supaClient } from '../../../supaClient';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';

const sortEmployees = (a: Profile, b: Profile) => {
    const aFirstName = a.first_name?.toLowerCase() || '';
    const bFirstName = b.first_name?.toLowerCase() || '';
    const aLastName = a.last_name?.toLowerCase() || '';
    const bLastName = b.last_name?.toLowerCase() || '';

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
    const { data: profiles } = useSuspenseQuery({
        queryKey: ['profiles'],
        queryFn: () => getAllEmployees(),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
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

    const queryClient = useQueryClient();

    const onSubmit = async (formData: FormValues) => {
        const { email, first_name, last_name, phone } = formData;

        toastRef.current = toast.loading('Creating employee...');

        // fetch a supabase edge function
        const { error } = await supaClient.functions.invoke('create-user', {
            body: { email, first_name, last_name, phone },
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY}`,
            },
        });

        // const { error } = await supaClient.rpc('create_user', {
        //     p_email: email,
        //     p_first_name: first_name,
        //     p_last_name: last_name,
        //     p_phone: phone,
        // });

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
            render: 'Employee created',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });

        queryClient.invalidateQueries({ queryKey: ['profiles'] });

        close();
    };

    return (
        <Stack direction="column" alignItems={'center'} gap={2}>
            <EmployeesTable employees={employees} />
            <Button onClick={open} variant="contained">
                Add New Employee
            </Button>
            <Dialog open={isOpen} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>Add Employee</DialogTitle>
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
                            rules={{ required: 'First name is required' }}
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
                            rules={{ required: 'Last name is required' }}
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
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
