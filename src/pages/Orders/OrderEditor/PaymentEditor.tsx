import { Control, Controller, FieldValues, Path, useForm } from 'react-hook-form';
import { LabeledStack } from '../../../rickcedlib/components/LabeledStack';
import { Payment, PaymentType, validators } from '../../../typesAndValidators';
import { Button, ButtonGroup, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { usePaymentCRUD } from '../../../api/payment';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import TextFieldWithMask from '../../../rickcedlib/components/TextFieldWithMask';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { PaymentTypeIcon } from '../PaymentTypeIcon';
import { formatCurrency } from '../../../utils';
import { useLayoutContext } from '../../../hooks/data/useContextData';

interface PaymentEditorProps {
    payment?: Payment;
    forNewPayment?: boolean;
    validPaymentTypes?: { value: PaymentType; label: string }[];
    orderID?: string;
    variant?: 'standard' | 'icon';
    defaultAmount?: number;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    disabled?: boolean;
}

const allPaymentTypes: { value: PaymentType; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'third_party', label: '3rd Party' },
];

type FormValues = Payment;

// TODO: explain that food is not included in this system and should be handled separately

export const PaymentEditor = ({
    payment,
    forNewPayment,
    orderID,
    validPaymentTypes = allPaymentTypes,
    variant = 'standard',
    defaultAmount = 0,
    isEditing = false,
    setIsEditing,
    disabled = false,
}: PaymentEditorProps) => {
    const [businessDate] = useBusinessDate();
    const { isMobile } = useLayoutContext();
    const defaultNewPayment = {
        payment_type: validPaymentTypes[0].value,
        amount_in_cents: defaultAmount,
        tip_in_cents: 0,
        special_note: '',
        order_id: orderID,
    };
    const {
        control,
        formState: { errors, isDirty, dirtyFields },
        setValue,
        handleSubmit,
        watch,
    } = useForm<FormValues>({
        defaultValues: forNewPayment ? defaultNewPayment : payment,
        reValidateMode: 'onChange',
    });
    const theme = useTheme();

    useEffect(() => {
        if (forNewPayment) {
            setValue('amount_in_cents', defaultAmount, { shouldDirty: false });
        }
    }, [defaultAmount, forNewPayment, setValue]);

    const { paymentMutations } = usePaymentCRUD({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });

    const onSubmit = (data: FormValues) => {
        if (forNewPayment) {
            paymentMutations.create(data);
        } else {
            paymentMutations.update(data);
        }
        setIsEditing(false);
    };

    const onDelete = (data: FormValues) => {
        paymentMutations.delete(data);
        setIsEditing(false);
    };

    const { handleConfirmation: handleDeletionConfirmation } = useConfirmationToast({
        message: 'Are you sure you want to delete this payment?',
        confirmProps: {
            handler: () => handleSubmit(onDelete)(),
            buttonText: 'Delete',
            color: 'error',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
        },
    });

    const handlePaymentTypeChange = (paymentType: PaymentType) => {
        setValue('payment_type', paymentType, { shouldDirty: true });
    };

    const paymentType = watch('payment_type');

    const paymentTypeName = paymentType.split('_').join(' ');

    const invalidPaymentType = !validPaymentTypes.find(({ value }) => value === paymentType);

    if (!isEditing) {
        if (forNewPayment) {
            return (
                <Button
                    onClick={() => setIsEditing(true)}
                    sx={{ width: '100%' }}
                    disabled={disabled}
                    className="payment-editor-add-payment">
                    Add Payment
                </Button>
            );
        } else if (payment) {
            return (
                <Button
                    onClick={() => setIsEditing(true)}
                    sx={{ padding: 0, width: '100%' }}
                    disabled={disabled}
                    className={`payment-editor-edit-payment payment-id-${payment.payment_id}`}>
                    <LabeledStack
                        style={{ cursor: 'pointer', width: '100%' }}
                        label={paymentTypeName + (invalidPaymentType ? ' (Invalid)' : '')}
                        color={invalidPaymentType ? theme.palette.error.main : ''}
                        direction="row"
                        spacing={2}
                        height={60}
                        alignItems="center"
                        justifyContent="space-between">
                        <PaymentTypeIcon paymentType={payment.payment_type} />
                        <Divider orientation="vertical" />
                        <Typography variant="body1" className="payment-amount-in-cents">
                            {formatCurrency(payment.amount_in_cents)}
                        </Typography>
                        <Divider orientation="vertical" />
                        <Typography variant="body1" className="payment-tip-in-cents">
                            {formatCurrency(payment.tip_in_cents)}
                        </Typography>
                        {!isMobile && (
                            <>
                                <Divider orientation="vertical" />
                                <Typography variant="body1">
                                    {formatCurrency(payment.amount_in_cents + payment.tip_in_cents)}
                                </Typography>
                            </>
                        )}
                    </LabeledStack>
                </Button>
            );
        }
    }

    return (
        <Stack
            direction="column"
            rowGap={2}
            className={`payment-editor-editing-payment payment-id-${payment?.payment_id || 'new'}`}>
            <LabeledStack
                label={paymentTypeName}
                color={isDirty || forNewPayment ? theme.palette.primary.main : ''}
                direction="column"
                justifyContent="space-between"
                mt={1}
                rowGap={4}
                // height={60}
                alignItems="center">
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Controller
                        name="amount_in_cents"
                        control={control}
                        rules={validators.payment.amount_in_cents}
                        render={({ field: { value } }) => {
                            return (
                                <TextFieldWithMask
                                    className="payment-amount-input"
                                    sx={{ minWidth: 100 }}
                                    label="Amount"
                                    maskVariant="currency"
                                    error={!!errors.amount_in_cents}
                                    value={value}
                                    handleChange={(value, shouldDirty) =>
                                        setValue('amount_in_cents', value, { shouldDirty })
                                    }
                                    isDirty={dirtyFields.amount_in_cents || forNewPayment}
                                />
                            );
                        }}
                    />
                    <Controller
                        name="tip_in_cents"
                        control={control}
                        rules={validators.payment.tip_in_cents}
                        render={({ field: { value } }) => {
                            return (
                                <TextFieldWithMask
                                    className="payment-tip-input"
                                    sx={{ minWidth: 100 }}
                                    label="Tip"
                                    maskVariant="currency"
                                    error={!!errors.tip_in_cents}
                                    value={value}
                                    handleChange={(value, shouldDirty) =>
                                        setValue('tip_in_cents', value, { shouldDirty })
                                    }
                                    isDirty={dirtyFields.tip_in_cents || forNewPayment}
                                />
                            );
                        }}
                    />
                </Stack>
                <PaymentTypeSelector
                    control={control}
                    isDirty={dirtyFields.payment_type || forNewPayment}
                    validPaymentTypes={validPaymentTypes}
                    handleChange={handlePaymentTypeChange}
                    variant={isMobile ? 'icon' : variant}
                />
            </LabeledStack>
            <Stack direction="row" justifyContent="flex-end" gap={2}>
                <Button onClick={() => setIsEditing(false)} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleDeletionConfirmation} color="error" variant="contained">
                    Delete
                </Button>
                <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty && !forNewPayment} variant="contained">
                    Save
                </Button>
            </Stack>
        </Stack>
    );
};

interface PaymentTypeSelectorProps<FV extends FieldValues> {
    control: Control<FV>;
    handleChange: (paymentType: PaymentType) => void;
    validPaymentTypes: { value: PaymentType; label: string }[];
    isDirty?: boolean;
    name?: Path<FV>;
    variant?: 'standard' | 'icon';
}

export const PaymentTypeSelector = <T extends FieldValues>({
    control,
    handleChange,
    validPaymentTypes,
    isDirty = false,
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
                        color={isDirty ? 'secondary' : 'primary'}
                        sx={{ width: '100%' }}
                        aria-label="Payment Type"
                        {...field}>
                        {validPaymentTypes.map((option) => {
                            const isSelected = option.value === field.value;
                            if (variant === 'standard') {
                                return (
                                    <Button
                                        key={option.value}
                                        variant={isSelected ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            handleChange(option.value);
                                        }}
                                        startIcon={<PaymentTypeIcon paymentType={option.value} />}>
                                        {option.label}
                                    </Button>
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
