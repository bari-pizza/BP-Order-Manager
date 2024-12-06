import { supaClient } from '../../supaClient';
import { SmartNavigate } from '../../components/SmartNavigate';
import { useUserContext } from '../../hooks/data/useContextData';
import { Controller, useForm } from 'react-hook-form';
import { Stack, Typography, TextField, Divider, Button, IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

type FormValues = {
    email: string;
    password: string;
    forgotPassword: boolean;
    showPassword: boolean;
};

export function Login() {
    const toastRef = useRef<Id>('');
    const { session } = useUserContext();
    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, dirtyFields, isSubmitting },
    } = useForm({ defaultValues: { email: '', password: '', forgotPassword: false, showPassword: false } });

    const mode = watch('forgotPassword') ? 'reset_password' : 'sign_in';
    const title = mode === 'reset_password' ? 'Reset Password' : 'Sign In';
    const showPassword = watch('showPassword');

    const onResetPassword = async (data: FormValues) => {
        toastRef.current = toast.loading(`Sending password reset email to ${data.email}`);
        const { error } = await supaClient.auth.resetPasswordForEmail(data.email);
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
            render: `Password reset email sent to ${data.email}`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
        reset({ password: '', forgotPassword: false, showPassword: false });
    };

    const onSignIn = async (data: FormValues) => {
        toastRef.current = toast.loading('Signing in...');
        const { data: userData, error } = await supaClient.auth.signInWithPassword({
            email: data.email,
            password: data.password,
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
            render: `Welcome back ${userData.user.email}!`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
    };

    if (!session) {
        return (
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} height="100vh">
                <Typography variant="h3">{title}</Typography>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
                {mode === 'reset_password' ? (
                    <Button
                        onClick={handleSubmit(onResetPassword)}
                        variant="contained"
                        color="primary"
                        disabled={!dirtyFields.email || isSubmitting}>
                        Reset Password
                    </Button>
                ) : (
                    <>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    variant="outlined"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    type={showPassword ? 'text' : 'password'}
                                    // TODO: add this to the theme instead of hardcoding it here
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:has(> input:-webkit-autofill)': {
                                                backgroundColor: 'rgb(232 240 254)',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Controller
                                                    name="showPassword"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => {
                                                        const handleClick = () => {
                                                            onChange(!value);
                                                        };
                                                        return (
                                                            <IconButton
                                                                onClick={handleClick}
                                                                edge="end"
                                                                aria-label="toggle password visibility">
                                                                {value ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        );
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Button
                            onClick={handleSubmit(onSignIn)}
                            variant="contained"
                            color="primary"
                            disabled={!dirtyFields.email || !dirtyFields.password || isSubmitting}>
                            Sign In
                        </Button>
                    </>
                )}
                <Controller
                    name="forgotPassword"
                    control={control}
                    render={({ field: { value } }) => {
                        const handleClick = () => {
                            if (value) {
                                reset({ password: '', forgotPassword: false, showPassword: false });
                            } else {
                                reset({ password: '', forgotPassword: true, showPassword: false });
                            }
                        };
                        return (
                            <Button onClick={handleClick} variant="text" color={value ? 'primary' : 'error'}>
                                {value ? 'Back' : 'Forgot Password'}
                            </Button>
                        );
                    }}
                />
                <Divider />
                <Typography variant="body1">Don't have an account yet?</Typography>
                <Typography variant="body1">Ask a manager to sign you up</Typography>
            </Stack>
        );
    }

    return <SmartNavigate keepSearchParams to="/" />;
}
