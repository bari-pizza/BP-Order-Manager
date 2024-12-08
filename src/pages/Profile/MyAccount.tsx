import { Stack, Button, Typography, TextField, Divider } from '@mui/material';
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
    password: string;
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
        formState: { errors },
        register,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            isEditing: false,
            email: profile?.email || '',
            password: '',
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            updatingPassword: false,
            newPassword: '',
            confirmNewPassword: '',
        },
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
    const password = watch('password');

    const onSubmit = (data: FormValues) => console.log(data);

    // TODO: handle submit (idk about changing email)

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
                                <Button onClick={handleClick} variant="contained" sx={{ width: 'fit-content' }}>
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
                                        validate: (value) => value === password || 'Passwords do not match',
                                    })}
                                    autoComplete="new-password"
                                    type="password"
                                    label="Confirm New Password"
                                    error={!!errors.confirmNewPassword}
                                    helperText={errors.confirmNewPassword?.message}
                                />
                                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
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
