import { Control, Controller, FieldValues, Path, useForm } from 'react-hook-form';
import { LabeledStack } from '../../../rickcedlib/LabeledStack';
import { Payment, PaymentType, validators } from '../../../typesAndValidators';
import { Button, ButtonGroup, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Money as CashIcon, CreditCard as CardIcon, AccountBalanceWallet as ThirdPartyIcon } from '@mui/icons-material';
import { usePaymentCRUD } from '../../../api/payment';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import { MotionWrapper } from '../../../rickcedlib/MotionWrapper';
import TextFieldWithMask from '../../../rickcedlib/TextFieldWithMask';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';

interface PaymentEditorProps {
    payment?: Payment;
    forNewPayment?: boolean;
    validPaymentTypes?: { value: PaymentType; label: string }[];
    orderID?: string;
    variant?: 'standard' | 'icon';
    defaultAmount?: number;
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
    defaultAmount = 0,
}: PaymentEditorProps) => {
    const [businessDate] = useBusinessDate();
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();
    const defaultNewPayment = {
        payment_type: validPaymentTypes[0].value,
        amount_in_cents: defaultAmount,
        tip_in_cents: 0,
        special_note: '',
        order_id: orderID,
    };
    const {
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

    useEffect(() => {
        if (forNewPayment) {
            setValue('amount_in_cents', defaultAmount);
        }
    }, [defaultAmount, forNewPayment, setValue]);

    const { paymentMutations } = usePaymentCRUD({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });

    const onSubmit = (data: FormValues) => {
        console.log(data);
        setIsEditing(false);
        if (forNewPayment) {
            paymentMutations.create(data);
        } else {
            paymentMutations.update(data);
        }
    };

    const onDelete = (data: FormValues) => {
        paymentMutations.delete(data);
    };

    const { handleConfirmation: handleDeletionConfirmation } = useConfirmationToast({
        message: 'Are you sure you want to delete this payment?',
        confirmProps: {
            handler: handleSubmit(onDelete),
            buttonText: 'Delete',
            color: 'error',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
        },
    });

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
            color={isEditing ? theme.palette.secondary.main : theme.palette.primary.main}
            height={60}
            alignItems="center">
            <AnimatePresence mode="wait" initial={false}>
                {isEditing && (
                    <MotionWrapper
                        motionKey="amount_in_cents_editing"
                        motionProps={motionProps}
                        stackProps={{ direction: 'row', gap: 2, justifyContent: 'space-between' }}>
                        <Tooltip title={errors.amount_in_cents?.message}>
                            <Controller
                                name="amount_in_cents"
                                control={control}
                                rules={validators.payment.amount_in_cents}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <TextFieldWithMask
                                            sx={{ minWidth: 100 }}
                                            label="Amount"
                                            maskVariant="currency"
                                            error={!!errors.amount_in_cents}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={errors.tip_in_cents?.message}>
                            <Controller
                                name="tip_in_cents"
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <TextFieldWithMask
                                            sx={{ minWidth: 100 }}
                                            label="Tip"
                                            maskVariant="currency"
                                            error={!!errors.tip_in_cents}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                }}
                            />
                        </Tooltip>
                        <PaymentTypeSelector
                            control={control}
                            validPaymentTypes={validPaymentTypes}
                            handleChange={handlePaymentTypeChange}
                            variant={variant}
                        />
                        <ButtonGroup orientation="horizontal" fullWidth color="primary" sx={{ width: '100%' }}>
                            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                            <Button onClick={() => setIsEditing(!isEditing)}>Cancel</Button>
                        </ButtonGroup>
                    </MotionWrapper>
                )}
                {!isEditing &&
                    (payment ? (
                        <MotionWrapper
                            motionKey="amount_in_cents_viewing"
                            motionProps={{ ...motionProps, style: { justifyContent: 'space-between', width: '100%' } }}
                            stackProps={{ direction: 'row', gap: 2, width: '100%' }}>
                            <LabeledStack label="Amount" direction="row" width="100%" alignLabel="left">
                                <Typography>${((payment?.amount_in_cents || 0) / 100).toFixed(2)}</Typography>
                            </LabeledStack>
                            <LabeledStack label="Tip" direction="row" width="100%" alignLabel="left">
                                <Typography>${((payment?.tip_in_cents || 0) / 100).toFixed(2)}</Typography>
                            </LabeledStack>
                            <ButtonGroup orientation="horizontal" fullWidth color="primary" sx={{ width: '100%' }}>
                                <Button onClick={() => setIsEditing(!isEditing)} variant="contained" color="primary">
                                    Edit
                                </Button>
                                <Button onClick={handleDeletionConfirmation} variant="contained" color="error">
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </MotionWrapper>
                    ) : (
                        <MotionWrapper
                            motionKey="amount_in_cents_viewing"
                            motionProps={{ ...motionProps, style: { width: '100%' } }}
                            stackProps={{ direction: 'row', gap: 2, justifyContent: 'space-between' }}>
                            <Button onClick={() => setIsEditing(!isEditing)} sx={{ width: '100%' }}>
                                Add Payment
                            </Button>
                        </MotionWrapper>
                    ))}
            </AnimatePresence>
            {/* {isEditing ? (
                <ButtonGroup>
                    <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                    <Button onClick={() => setIsEditing(!isEditing)}>Cancel</Button>
                </ButtonGroup>
            ) : (
                payment && (
                    <ButtonGroup>
                        <Button onClick={() => setIsEditing(!isEditing)} variant="contained" color="primary">
                            Edit
                        </Button>
                        <Button onClick={handleSubmit(onDelete)} variant="contained" color="error">
                            Delete
                        </Button>
                    </ButtonGroup>
                    // <>
                    //     <Button onClick={() => setIsEditing(!isEditing)} variant="contained" color="primary">
                    //         Edit
                    //     </Button>
                    //     <Button onClick={handleSubmit(onDelete)} variant="contained" color="error">
                    //         Delete
                    //     </Button>
                    // </>
                )
            )} */}
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
