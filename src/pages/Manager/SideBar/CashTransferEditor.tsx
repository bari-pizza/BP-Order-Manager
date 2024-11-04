import { Controller, useForm } from 'react-hook-form';
import { LabeledStack } from '../../../rickcedlib/LabeledStack';
import { CashTransfer, CashTransferType, validators } from '../../../typesAndValidators';
import { Button, Divider, Stack, Typography, useTheme } from '@mui/material';
// import { usePaymentCRUD } from '../../../api/payment';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import TextFieldWithMask from '../../../rickcedlib/TextFieldWithMask';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
// import { PaymentTypeIcon } from '../PaymentTypeIcon';
import { formatCurrency } from '../../../utils';
import { useManagerDashboardContext } from '../../../hooks/data/useContextData';

interface CashTransferEditorProps {
    cashTransfer?: CashTransfer;
    forNewCashTransfer?: boolean;
    drawerID?: string;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

// const allCashTransferTypes: { value: CashTransferType; label: string }[] = [
//     { value: 'bank', label: 'Bank' },
//     { value: 'payment', label: 'Payment' },
//     { value: 'other', label: 'Other' },
// ];

type FormValues = CashTransfer;

export const CashTransferEditor = ({
    cashTransfer,
    forNewCashTransfer,
    drawerID,
    isEditing = false,
    setIsEditing,
}: CashTransferEditorProps) => {
    const [businessDate] = useBusinessDate();
    const defaultNewCashTransfer = {
        amount_in_cents: 0,
        source: drawerID,
        destination: '',
        business_date: businessDate.format('YYYY-MM-DD'),
        title: '',
        special_note: '',
        transfer_type: 'other' as CashTransferType,
    };
    const {
        control,
        formState: { errors, isDirty, dirtyFields },
        setValue,
        handleSubmit,
        watch,
    } = useForm<FormValues>({
        defaultValues: forNewCashTransfer ? defaultNewCashTransfer : cashTransfer,
        reValidateMode: 'onChange',
    });
    const theme = useTheme();
    const { cashTransfers } = useManagerDashboardContext();

    // const { paymentMutations } = usePaymentCRUD({ queryKey: ['orders', businessDate.format('YYYY-MM-DD')] });

    const onSubmit = (data: FormValues) => {
        if (forNewCashTransfer) {
            cashTransfers.create(data);
            // paymentMutations.create(data);
        } else {
            cashTransfers.update(data);
            // paymentMutations.update(data);
        }
        setIsEditing(false);
    };

    const onDelete = (data: FormValues) => {
        cashTransfers.delete(data);
        // paymentMutations.delete(data);
        setIsEditing(false);
    };

    const { handleConfirmation: handleDeletionConfirmation } = useConfirmationToast({
        message: 'Are you sure you want to delete this cash transfer?',
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

    // const handleCashTransferTypeChange = (cashTransferType: CashTransferType) => {
    //     setValue('transfer_type', cashTransferType, { shouldDirty: true });
    // };

    if (!isEditing) {
        if (forNewCashTransfer) {
            return (
                <Button onClick={() => setIsEditing(true)} sx={{ width: '100%' }}>
                    New Cash Transfer
                </Button>
            );
        } else if (cashTransfer) {
            return (
                // TODO: CONTINUE HERE
                // should show where the cash transfer came from
                // should show where the cash transfer went to
                // should also allow the user to select from: register 1, register 2, outside
                // OR should allow the user to select to: register 1, register 2, outside
                <Stack direction="column" rowGap={2} mt={2}>
                    <LabeledStack
                        style={{ cursor: 'pointer' }}
                        label={cashTransfer.transfer_type.split('_').join(' ')}
                        direction="row"
                        spacing={2}
                        height={60}
                        alignItems="center"
                        justifyContent="space-between"
                        onClick={() => setIsEditing(true)}>
                        {/* <PaymentTypeIcon paymentType={payment.payment_type} /> */}
                        <Divider orientation="vertical" />
                        <Typography variant="body1">{formatCurrency(cashTransfer.amount_in_cents)}</Typography>
                        {/* <Divider orientation="vertical" />
                    <Typography variant="body1">{formatCurrency(cashTransfer.tip_in_cents)}</Typography> */}
                        {/* <Divider orientation="vertical" />
                    <Typography variant="body1">
                    {formatCurrency(payment.amount_in_cents + payment.tip_in_cents)}
                    </Typography> */}
                    </LabeledStack>
                </Stack>
            );
        }
    }

    const transferTypeName = watch('transfer_type').split('_').join(' ');

    return (
        <Stack direction="column" rowGap={2} mt={2}>
            <LabeledStack
                label={transferTypeName}
                color={isDirty || forNewCashTransfer ? theme.palette.secondary.main : theme.palette.primary.main}
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
                                    sx={{ minWidth: 100 }}
                                    label="Amount"
                                    maskVariant="currency"
                                    error={!!errors.amount_in_cents}
                                    value={value}
                                    handleChange={(value, shouldDirty) =>
                                        setValue('amount_in_cents', value, { shouldDirty })
                                    }
                                    color={dirtyFields.amount_in_cents || forNewCashTransfer ? 'secondary' : 'primary'}
                                    focused
                                />
                            );
                        }}
                    />
                    {/* <Controller
                        name="tip_in_cents"
                        control={control}
                        rules={validators.payment.tip_in_cents}
                        render={({ field: { value } }) => {
                            return (
                                <TextFieldWithMask
                                    sx={{ minWidth: 100 }}
                                    label="Tip"
                                    maskVariant="currency"
                                    error={!!errors.tip_in_cents}
                                    value={value}
                                    handleChange={(value, shouldDirty) =>
                                        setValue('tip_in_cents', value, { shouldDirty })
                                    }
                                    color={dirtyFields.tip_in_cents || forNewPayment ? 'secondary' : 'primary'}
                                    focused
                                />
                            );
                        }}
                    /> */}
                </Stack>
                {/* <TransferTypeSelector
                    control={control}
                    isDirty={dirtyFields.transfer_type || forNewCashTransfer}
                    handleChange={handleCashTransferTypeChange}
                /> */}
            </LabeledStack>
            <Stack direction="row" justifyContent="flex-end" gap={2}>
                <Button onClick={() => setIsEditing(false)} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleDeletionConfirmation} color="error" variant="contained">
                    Delete
                </Button>
                <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty && !forNewCashTransfer} variant="contained">
                    Save
                </Button>
            </Stack>
        </Stack>
    );
};

// interface TransferTypeSelectorProps<FV extends FieldValues> {
//     control: Control<FV>;
//     handleChange: (cashTransferType: CashTransferType) => void;
//     isDirty?: boolean;
//     name?: Path<FV>;
// }

// export const TransferTypeSelector = <T extends FieldValues>({
//     control,
//     handleChange,
//     isDirty = false,
//     name = 'payment_type' as Path<T>,
// }: TransferTypeSelectorProps<T>) => {
//     return (
//         <Controller
//             name={name}
//             control={control}
//             render={({ field }) => {
//                 return (
//                     <ButtonGroup
//                         orientation="horizontal"
//                         fullWidth
//                         color={isDirty ? 'secondary' : 'primary'}
//                         sx={{ width: '100%' }}
//                         aria-label="Payment Type"
//                         {...field}>
//                         {allCashTransferTypes.map((option) => {
//                             const isSelected = option.value === field.value;
//                             return (
//                                 <Button
//                                     key={option.value}
//                                     variant={isSelected ? 'contained' : 'outlined'}
//                                     onClick={() => {
//                                         handleChange(option.value);
//                                     }}>
//                                     {option.label}
//                                 </Button>
//                             );
//                         })}
//                     </ButtonGroup>
//                 );
//             }}
//         />
//     );
// };
