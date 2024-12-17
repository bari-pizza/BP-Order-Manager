import { Stack, Button, Typography, TextField, Divider, Skeleton } from '@mui/material';
import { supaClient } from '../../supaClient';
import { useUserContext } from '../../hooks/data/useContextData';
import { AvatarUploader } from './AvatarUploader';
import { Controller, useForm } from 'react-hook-form';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
// import { useConfirmationToast } from '../../toast/useConfirmationToast';

// TODO: Add a way to edit profile (avatar_src, first_name, last_name,  password)
type FormValues = {
    isEditing: boolean;
    updatingPassword: boolean;
    newPassword: string;
    confirmNewPassword: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
};

export const MyAccount = () => {
    const { profile } = useUserContext();
    const toastRef = useRef<Id>('');
    // const { isMobile } = useUserContext();
    const {
        handleSubmit,
        control,
        formState: { errors, dirtyFields },
        register,
        setValue,
        watch,
        getValues,
    } = useForm({
        defaultValues: {
            isEditing: false,
            email: profile?.email || '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            updatingPassword: false,
            newPassword: '',
            confirmNewPassword: '',
        },
        mode: 'onChange',
    });

    const handleLogout = async () => {
        toastRef.current = toast.loading('Logging out...');
        const { error } = await supaClient.auth.signOut();
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
            render: 'See ya!',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
    };

    const isEditing = watch('isEditing');
    const updatingPassword = watch('updatingPassword');

    const onSubmit = async ({ first_name, last_name, phone, email }: FormValues) => {
        toastRef.current = toast.loading('Updating profile...');

        if (dirtyFields.email) {
            await supaClient.auth.updateUser({ email }).then(({ error }) => {
                if (error) {
                    toast.update(toastRef.current, {
                        render: error.message,
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                    });
                    toast.info('Make sure to check your inbox to verify your email');
                    return;
                }
            });
        }

        if (dirtyFields.first_name || dirtyFields.last_name || dirtyFields.phone || dirtyFields.email) {
            const { error } = await supaClient
                .from('Profile')
                .update({ first_name, last_name, phone, email })
                .eq('id', profile?.id)
                .select();

            if (error) {
                toast.update(toastRef.current, {
                    render: error.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
                return;
            }
        }

        toast.update(toastRef.current, {
            render: 'Profile updated successfully',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
        setValue('isEditing', false);
    };

    const onSubmitPassword = async ({ newPassword }: FormValues) => {
        toastRef.current = toast.loading('Updating password...');
        await supaClient.auth.updateUser({ password: newPassword }).then(({ error }) => {
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
                render: 'Password updated successfully',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            setValue('updatingPassword', false);
            setValue('newPassword', '');
            setValue('confirmNewPassword', '');
        });
    };

    // TODO: handle submit (idk about changing email)
    // TODO: break up into left and right side and then render differently if isMobile

    return (
        <Stack
            direction="column"
            height="calc(100vh - 64px)"
            spacing={2}
            margin={4}
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="h3">My Account</Typography>

            <Stack direction="row" height="-webkit-fill-available" spacing={2} m={4} flexGrow={1}>
                <Stack direction="column" alignItems="center" width="300px" p={2} spacing={4}>
                    <AvatarUploader profile={profile} />
                    {isEditing ? (
                        <Stack direction="column" spacing={2}>
                            <TextField {...register('first_name')} label="First Name" />
                            <TextField {...register('last_name')} label="Last Name" />
                            <TextField {...register('phone')} label="Phone" />
                            <TextField {...register('email')} label="Email" />
                        </Stack>
                    ) : (
                        <>
                            <Typography variant="body1">
                                {profile?.first_name} {profile?.last_name}
                            </Typography>
                            <Typography variant="body1">{profile?.email}</Typography>
                            <Typography variant="body1"> {profile?.phone}</Typography>
                        </>
                    )}

                    <Controller
                        name="isEditing"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            const handleClick = () => {
                                if (!value) {
                                    setValue('first_name', profile?.first_name || '');
                                    setValue('last_name', profile?.last_name || '');
                                    setValue('phone', profile?.phone || '');
                                    setValue('email', profile?.email || '');
                                }
                                onChange(!value);
                            };
                            if (value) {
                                return (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit(onSubmit)}
                                            sx={{ width: 'fit-content' }}>
                                            Submit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleClick}
                                            sx={{ width: 'fit-content' }}>
                                            Cancel Changes
                                        </Button>
                                    </>
                                );
                            }

                            return (
                                <Button onClick={handleClick} variant="text" sx={{ width: 'fit-content' }}>
                                    Edit Profile
                                </Button>
                            );
                        }}
                    />
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack direction="column" gap={2} width="300px" p={2} justifyContent="space-evenly" alignItems="center">
                    <Stack direction="column" alignItems="center" gap={2}>
                        {updatingPassword && (
                            <>
                                <TextField
                                    {...register('newPassword', {
                                        required: "Password can't be empty",
                                        minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                                    })}
                                    autoComplete="new-password"
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword?.message}
                                />
                                <TextField
                                    {...register('confirmNewPassword', {
                                        required: 'Passwords must match',
                                        validate: (value) => {
                                            const { newPassword } = getValues();
                                            return value === newPassword || 'Passwords do not match';
                                        },
                                    })}
                                    autoComplete="new-password"
                                    type="password"
                                    label="Confirm New Password"
                                    error={!!errors.confirmNewPassword}
                                    helperText={errors.confirmNewPassword?.message}
                                />
                                <Button variant="contained" onClick={handleSubmit(onSubmitPassword)}>
                                    Save Password
                                </Button>
                            </>
                        )}
                        <Controller
                            name="updatingPassword"
                            control={control}
                            render={({ field: { onChange, value } }) => {
                                const handleClick = () => {
                                    if (value) {
                                        setValue('newPassword', '');
                                        setValue('confirmNewPassword', '');
                                    }
                                    onChange(!value);
                                };

                                return (
                                    <Button
                                        variant={value ? 'outlined' : 'text'}
                                        color={value ? 'error' : 'primary'}
                                        onClick={handleClick}
                                        sx={{ width: 'fit-content' }}>
                                        {value ? 'Cancel' : 'Update Password'}
                                    </Button>
                                );
                            }}
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Button onClick={handleLogout} sx={{ width: 'fit-content' }}>
                Logout
            </Button>
        </Stack>
    );
};

export const MyAccountSkeleton = () => {
    return (
        <Stack direction="column" sx={{ height: '100%' }} mt={2}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
        </Stack>
    );
};
