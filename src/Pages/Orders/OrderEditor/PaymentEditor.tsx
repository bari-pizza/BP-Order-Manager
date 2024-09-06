import { Control, Controller, FieldValues, Path, useForm } from 'react-hook-form';
import { LabeledStack } from '../../../rickcedlib/LabeledStack';
import { Payment, PaymentType, validators } from '../../../typesAndValidators';
import { Button, ButtonGroup, Stack, StackProps, TextField, Tooltip, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { Money as CashIcon, CreditCard as CardIcon, AccountBalanceWallet as ThirdPartyIcon } from '@mui/icons-material';

interface PaymentEditorProps {
    payment?: Payment;
    forNewPayment?: boolean;
    validPaymentTypes?: { value: PaymentType; label: string }[];
    orderID?: string;
    variant?: 'standard' | 'icon';
}

const allPaymentTypes: { value: PaymentType; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'third_party', label: '3rd Party' },
];

type FormValues = Payment;

export const PaymentEditor = ({
    payment,
    forNewPayment,
    orderID,
    validPaymentTypes = allPaymentTypes,
    variant = 'standard',
}: PaymentEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const defaultNewPayment = {
        payment_type: validPaymentTypes[0].value,
        amount_in_cents: 0,
        tip_in_cents: 0,
        special_notes: '',
        order_id: orderID,
    };
    const {
        register,
        control,
        // setError,
        formState: { errors },
        // reset,
        setValue,
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: forNewPayment ? defaultNewPayment : payment,
        reValidateMode: 'onChange',
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
        setIsEditing(false);
    };

    const motionProps = {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
    };

    const handlePaymentTypeChange = (paymentType: PaymentType) => {
        setValue('payment_type', paymentType);
    };

    return (
        <LabeledStack
            label={payment ? payment?.payment_type : 'New Payment'}
            direction="row"
            justifyContent="space-between"
            height={60}
            alignItems="center">
            <AnimatePresence mode="wait" initial={false}>
                {isEditing && (
                    <MotionWrapper
                        key="amount_in_cents_editing"
                        motionProps={motionProps}
                        stackProps={{ direction: 'row', gap: 2 }}>
                        <Tooltip title={errors.amount_in_cents?.message}>
                            <TextField
                                label="Amount"
                                {...register('amount_in_cents', { ...validators.payment.amount_in_cents })}
                                error={!!errors.amount_in_cents}
                                // helperText={errors.amount_in_cents?.message}
                            />
                        </Tooltip>
                        <Tooltip title={errors.tip_in_cents?.message}>
                            <TextField
                                key="tip_in_cents"
                                label="Tip"
                                {...register('tip_in_cents', { ...validators.payment.tip_in_cents })}
                                error={!!errors.tip_in_cents}
                                // helperText={errors.tip_in_cents?.message}
                            />
                        </Tooltip>
                        <PaymentTypeSelector
                            control={control}
                            validPaymentTypes={validPaymentTypes}
                            handleChange={handlePaymentTypeChange}
                            variant={variant}
                        />
                    </MotionWrapper>
                )}
                {!isEditing &&
                    (payment ? (
                        <MotionWrapper
                            key="amount_in_cents_viewing"
                            motionProps={motionProps}
                            stackProps={{ direction: 'row', gap: 2, justifyContent: 'space-between' }}>
                            <LabeledStack label="Amount" direction="row" width="100%" alignLabel="left">
                                <Typography>${((payment?.amount_in_cents || 0) / 100).toFixed(2)}</Typography>
                            </LabeledStack>
                            <LabeledStack label="Tip" direction="row" width="100%" alignLabel="left">
                                <Typography>${((payment?.amount_in_cents || 0) / 100).toFixed(2)}</Typography>
                            </LabeledStack>
                        </MotionWrapper>
                    ) : (
                        <MotionWrapper
                            key="amount_in_cents_viewing"
                            motionProps={{ ...motionProps, style: { width: '100%' } }}
                            stackProps={{ direction: 'row', gap: 2, justifyContent: 'space-between' }}>
                            <Button onClick={() => setIsEditing(!isEditing)} sx={{ width: '100%' }}>
                                Add Payment
                            </Button>
                        </MotionWrapper>
                    ))}
            </AnimatePresence>
            {isEditing ? (
                <Button onClick={handleSubmit(onSubmit)}>Save</Button>
            ) : (
                payment && <Button onClick={() => setIsEditing(!isEditing)}>Edit</Button>
            )}
        </LabeledStack>
    );
};

interface PaymentTypeSelectorProps<FV extends FieldValues> {
    control: Control<FV>;
    handleChange: (paymentType: PaymentType) => void;
    validPaymentTypes: { value: PaymentType; label: string }[];
    name?: Path<FV>;
    variant?: 'standard' | 'icon';
}

export const PaymentTypeSelector = <T extends FieldValues>({
    control,
    handleChange,
    validPaymentTypes,
    name = 'payment_type' as Path<T>,
    variant = 'standard',
}: PaymentTypeSelectorProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                return (
                    <ButtonGroup
                        orientation="horizontal"
                        fullWidth
                        color="primary"
                        sx={{ width: '100%' }}
                        aria-label="Payment Type"
                        {...field}>
                        {validPaymentTypes.map((option) => {
                            const isSelected = option.value === field.value;
                            if (variant === 'icon') {
                                let icon = <CashIcon />;
                                if (option.value === 'card') {
                                    icon = <CardIcon />;
                                } else if (option.value === 'third_party') {
                                    icon = <ThirdPartyIcon />;
                                }
                                return (
                                    <Tooltip key={option.value} title={option.label}>
                                        <Button
                                            key={option.value}
                                            variant={isSelected ? 'contained' : 'outlined'}
                                            onClick={() => {
                                                handleChange(option.value);
                                            }}>
                                            {icon}
                                        </Button>
                                    </Tooltip>
                                );
                            }
                            return (
                                <Button
                                    key={option.value}
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    onClick={() => {
                                        handleChange(option.value);
                                    }}>
                                    {option.label}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                );
            }}
        />
    );
};

interface MotionWrapperProps {
    children: ReactNode;
    motionProps?: MotionProps;
    stackProps?: StackProps;
    key?: string;
}

const MotionWrapper = ({ motionProps, stackProps, children, key }: MotionWrapperProps) => {
    return (
        <motion.div
            key={key}
            {...motionProps}
            // initial={{ y: -100, opacity: 0 }}
            // animate={{ y: 0, opacity: 1 }}
            // exit={{ y: -100, opacity: 0 }}
        >
            <Stack {...stackProps}>
                {/* <Stack direction="row" gap={2}> */}
                {children}
            </Stack>
        </motion.div>
    );
};
