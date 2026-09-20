import {
    Stack,
    Button,
    Typography,
    TextField,
    Autocomplete,
    Paper,
    Box,
} from '@mui/material';
import {
    EditOutlined,
    LockOutlined,
    Logout as LogoutIcon,
    MailOutline,
    PhoneOutlined,
    PhotoCamera,
} from '@mui/icons-material';
import { supaClient } from '../../supaClient';
import { useLayoutContext, useUserContext } from '../../hooks/data/useContextData';
import { AvatarUploader } from './AvatarUploader';
import { Controller, useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { Id, toast } from '../../toast/toastWrapper';
import 'dayjs/locale/es-us';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { SmartTextField } from '../../rickcedlib/components/SmartTextField';
import { m } from '../../types/messages';

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

type ValidLanguageCode = 'en' | 'es' | 'pt';

const panelSx = {
    p: { xs: 2.5, sm: 3 },
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    boxShadow: 'none',
} as const;

export const MyAccount = () => {
    const { profile } = useUserContext();
    const toastRef = useRef<Id>('');
    const { isMobile } = useLayoutContext();
    const [languageSubmitting, setLanguageSubmitting] = useState(false);

    const profileLocale = (profile?.locale || 'en') as ValidLanguageCode;

    const dictionary: {
        [languageCode: string]: {
            dayJSLocale: string;
            text: string;
        };
    } = {
        es: { dayJSLocale: 'es-us', text: 'Español' },
        pt: { dayJSLocale: 'pt-br', text: 'Português' },
        en: { dayJSLocale: 'en', text: 'English (US)' },
    };

    const handleLanguageChange = async (newLanguageCode: ValidLanguageCode | null) => {
        if (!newLanguageCode) return;
        const dayJSLocale = dictionary[newLanguageCode]?.dayJSLocale || 'en';
        dayjs.locale(dayJSLocale);
        setLanguageSubmitting(true);
        await supaClient.from('Profile').update({ locale: newLanguageCode }).eq('id', profile?.id);
        setLanguageSubmitting(false);
        toast.info(m.loading(null, { locale: newLanguageCode }) + ` ${dictionary[newLanguageCode]?.text}...`);
    };

    const {
        handleSubmit,
        control,
        formState: { errors, dirtyFields },
        register,
        setValue,
        watch,
        getValues,
        reset,
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

    const beginEdit = () => {
        reset({
            ...getValues(),
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            email: profile?.email || '',
            isEditing: true,
        });
    };

    const cancelEdit = () => {
        reset({
            ...getValues(),
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            email: profile?.email || '',
            isEditing: false,
        });
    };

    const onSubmit = async ({ first_name, last_name, phone, email }: FormValues) => {
        toastRef.current = toast.loading(m.updatingTarget({ targetName: m.profile() }));

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
        reset({ ...getValues(), first_name, last_name, phone, email, isEditing: false });
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

    const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Your profile';

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: 'calc(100vh - 64px)',
                bgcolor: 'grey.50',
                overflow: 'auto',
            }}>
            <Stack
                direction="column"
                spacing={2.5}
                sx={{
                    width: '100%',
                    maxWidth: 960,
                    mx: 'auto',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 2.5, sm: 3.5 },
                    boxSizing: 'border-box',
                }}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    My Account
                </Typography>

                <Paper elevation={0} sx={panelSx}>
                    <Stack
                        direction={isMobile ? 'column' : 'row'}
                        spacing={3}
                        alignItems={isMobile ? 'center' : 'center'}
                        justifyContent="space-between">
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2.5}
                            alignItems="center"
                            sx={{ flex: 1, minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
                            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                <AvatarUploader profile={profile} />
                                <Box
                                    aria-hidden
                                    sx={{
                                        position: 'absolute',
                                        right: 4,
                                        bottom: 4,
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        width: 32,
                                        height: 32,
                                        border: '2px solid',
                                        borderColor: 'background.paper',
                                        pointerEvents: 'none',
                                    }}>
                                    <PhotoCamera sx={{ fontSize: 16 }} />
                                </Box>
                            </Box>

                            <Stack
                                spacing={1}
                                alignItems={isMobile ? 'center' : 'flex-start'}
                                sx={{ flex: 1, minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
                                {isEditing ? (
                                    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360 }}>
                                        <TextField {...register('first_name')} label="First Name" fullWidth size="small" />
                                        <TextField {...register('last_name')} label="Last Name" fullWidth size="small" />
                                        <TextField {...register('phone')} label="Phone" fullWidth size="small" />
                                        <TextField {...register('email')} label="Email" fullWidth size="small" />
                                        <Stack direction="row" spacing={1} justifyContent={isMobile ? 'center' : 'flex-start'}>
                                            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                                                Save
                                            </Button>
                                            <Button variant="outlined" color="error" onClick={cancelEdit}>
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <>
                                        <Typography variant="h5" fontWeight={700} textAlign={isMobile ? 'center' : 'left'}>
                                            {displayName}
                                        </Typography>
                                        {profile?.email && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <MailOutline sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {profile.email}
                                                </Typography>
                                            </Stack>
                                        )}
                                        {profile?.phone && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PhoneOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profile.phone}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </Stack>

                        {!isEditing && (
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditOutlined />}
                                onClick={beginEdit}
                                fullWidth={isMobile}
                                sx={{ flexShrink: 0, alignSelf: isMobile ? 'stretch' : 'center' }}>
                                Edit profile
                            </Button>
                        )}
                    </Stack>
                </Paper>

                <Stack direction={isMobile ? 'column' : 'row'} spacing={2.5} alignItems="stretch">
                    <Paper elevation={0} sx={{ ...panelSx, flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>
                            Security
                        </Typography>
                        <Stack spacing={2}>
                            {updatingPassword ? (
                                <>
                                    <TextField
                                        {...register('newPassword', {
                                            required: "Password can't be empty",
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters long',
                                            },
                                        })}
                                        autoComplete="new-password"
                                        fullWidth
                                        size="small"
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
                                        fullWidth
                                        size="small"
                                        type="password"
                                        label="Confirm New Password"
                                        error={!!errors.confirmNewPassword}
                                        helperText={errors.confirmNewPassword?.message}
                                    />
                                    <Stack direction="row" spacing={1}>
                                        <Button variant="contained" onClick={handleSubmit(onSubmitPassword)} fullWidth>
                                            Save password
                                        </Button>
                                        <Controller
                                            name="updatingPassword"
                                            control={control}
                                            render={({ field: { onChange } }) => (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    fullWidth
                                                    onClick={() => {
                                                        setValue('newPassword', '');
                                                        setValue('confirmNewPassword', '');
                                                        onChange(false);
                                                    }}>
                                                    Cancel
                                                </Button>
                                            )}
                                        />
                                    </Stack>
                                </>
                            ) : (
                                <Controller
                                    name="updatingPassword"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            fullWidth
                                            startIcon={<LockOutlined />}
                                            onClick={() => onChange(true)}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                borderColor: 'divider',
                                                color: 'text.primary',
                                                py: 1.25,
                                            }}>
                                            Update password
                                        </Button>
                                    )}
                                />
                            )}

                            <Box>
                                <Typography variant="body2" color="text.secondary" mb={0.75}>
                                    Language
                                </Typography>
                                <Autocomplete
                                    options={['en', 'pt', 'es'] as ValidLanguageCode[]}
                                    value={profileLocale}
                                    fullWidth
                                    onChange={(_, value) => handleLanguageChange(value)}
                                    renderInput={(params) => (
                                        <SmartTextField
                                            {...params}
                                            inputProps={{ ...params.inputProps, 'aria-label': 'Language' }}
                                            value={profileLocale}
                                            label=""
                                            isDirty={languageSubmitting}
                                            size="small"
                                        />
                                    )}
                                    getOptionLabel={(option) => dictionary[option]?.text ?? option}
                                />
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ ...panelSx, flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>
                            Session
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ py: 1.25 }}>
                            Logout
                        </Button>
                        <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
                            Signs you out on this device.
                        </Typography>
                    </Paper>
                </Stack>
            </Stack>
        </Box>
    );
};
