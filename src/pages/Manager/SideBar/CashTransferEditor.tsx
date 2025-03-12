import { Controller, useForm } from 'react-hook-form';
import { LabeledStack } from '../../../rickcedlib/components/LabeledStack';
import {
    CashTransfer,
    CashTransferType,
    Drawer,
    Driver_Drawer,
    NewCashTransfer,
    validators,
} from '../../../typesAndValidators';
import { Autocomplete, Button, ButtonGroup, IconButton, Stack, Typography } from '@mui/material';
import { useBusinessDate } from '../../../hooks/data/useBusinessDate';
import TextFieldWithMask from '../../../rickcedlib/components/TextFieldWithMask';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { formatCurrency } from '../../../utils';
import { useBariPizzaContext, useManagerDashboardContext } from '../../../hooks/data/useContextData';
import {
    East as ArrowRightIcon,
    West as ArrowLeftIcon,
    DeleteForever as DeleteForeverIcon,
    Save as SaveIcon,
    Replay as CancelIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { InfoPopover } from '../../../rickcedlib/components/InfoPopover';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';

interface CashTransferEditorBaseProps {
    drawerID: string;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    transferType?: CashTransferType;
}

interface NewCashTransferProps extends CashTransferEditorBaseProps {
    forNewCashTransfer: true;
    cashTransfer?: undefined;
    canCreateBankTransfer?: boolean;
    definedValues?: {
        cashTransfer?: Partial<NewCashTransfer>;
        toFromSpentReceived?: 'spent' | 'received' | 'to' | 'from';
        completedFirstStep?: boolean;
        validDrawerFilter?: (drawer: Drawer | Driver_Drawer) => boolean;
    };
}

interface ExistingCashTransferProps extends CashTransferEditorBaseProps {
    forNewCashTransfer?: false;
    cashTransfer: CashTransfer;
    canCreateBankTransfer?: false;
    definedValues?: undefined;
}

type CashTransferEditorProps = NewCashTransferProps | ExistingCashTransferProps;

interface FormValuesBase {
    toFromSpentReceived: 'spent' | 'received' | 'to' | 'from';
    completedFirstStep: boolean;
}

interface FormValuesForNewCashTransfer extends FormValuesBase {
    cashTransfer: NewCashTransfer;
}

interface FormValuesForExistingCashTransfer extends FormValuesBase {
    cashTransfer: CashTransfer;
}

type FormValues = FormValuesForNewCashTransfer | FormValuesForExistingCashTransfer;

function isExistingCashTransfer(cashTransfer: CashTransfer | NewCashTransfer): cashTransfer is CashTransfer {
    return (cashTransfer as CashTransfer).cash_transfer_id !== undefined;
}

const getFormValues = (cashTransfer: CashTransfer | NewCashTransfer, drawerID: string) => {
    const toFromSpentReceived =
        cashTransfer.source === drawerID
            ? cashTransfer.destination
                ? 'to'
                : 'spent'
            : cashTransfer.source
              ? 'from'
              : 'received';
    return {
        cashTransfer,
        toFromSpentReceived: toFromSpentReceived as 'spent' | 'received' | 'to' | 'from',
        completedFirstStep: true,
    };
};

export const CashTransferEditor = ({
    cashTransfer,
    forNewCashTransfer,
    drawerID,
    transferType = 'other',
    isEditing = false,
    setIsEditing,
    canCreateBankTransfer,
    definedValues,
}: CashTransferEditorProps) => {
    const [businessDate] = useBusinessDate();
    const { constants } = useBariPizzaContext();
    const { drawers, drivers } = useManagerDashboardContext();

    const defaultValues: FormValues = forNewCashTransfer
        ? {
              cashTransfer: {
                  amount_in_cents: definedValues?.cashTransfer?.amount_in_cents ?? 0,
                  source: definedValues?.cashTransfer?.source ?? drawerID,
                  destination: definedValues?.cashTransfer?.destination ?? '',
                  business_date: businessDate.format('YYYY-MM-DD'),
                  title: definedValues?.cashTransfer?.title ?? '',
                  special_note: definedValues?.cashTransfer?.special_note ?? '',
                  transfer_type: transferType,
              },
              toFromSpentReceived: definedValues?.toFromSpentReceived ?? 'spent',
              completedFirstStep: definedValues?.completedFirstStep ?? false,
          }
        : getFormValues(cashTransfer, drawerID);

    console.log({ defaultValues });

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit,
        watch,
        reset,
        register,
    } = useForm<FormValues>({
        defaultValues,
        reValidateMode: 'onChange',
    });
    const { cashTransfers } = useManagerDashboardContext();

    const onSubmit = (data: FormValues) => {
        const { cashTransfer } = data;
        // replace empty string with null in source and destination
        cashTransfer.source = cashTransfer.source === '' ? null : cashTransfer.source;
        cashTransfer.destination = cashTransfer.destination === '' ? null : cashTransfer.destination;
        cashTransfer.business_date = businessDate.format('YYYY-MM-DD');
        if (isExistingCashTransfer(cashTransfer)) {
            cashTransfers.update(cashTransfer);
        } else {
            console.log({ cashTransfer });
            cashTransfers.create(cashTransfer);
            reset({
                cashTransfer: {
                    amount_in_cents: 0,
                    source: drawerID,
                    destination: '',
                    business_date: businessDate.format('YYYY-MM-DD'),
                    title: '',
                    special_note: '',
                    transfer_type: transferType,
                },
                toFromSpentReceived: 'spent',
                completedFirstStep: false,
            });
        }
        setIsEditing(false);
    };

    const onDelete = (data: FormValues) => {
        const { cashTransfer } = data;
        if (isExistingCashTransfer(cashTransfer)) {
            cashTransfers.delete(cashTransfer);
        }
        setIsEditing(false);
    };

    const { handleConfirmation: handleDeletionConfirmation } = useConfirmationToast({
        message: 'Are you sure you want to delete this cash transfer?',
        confirmProps: {
            handler: () => handleSubmit(onDelete),
            buttonText: 'Delete',
            color: 'error',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'info',
        },
    });

    const handleCancel = () => {
        reset(defaultValues);
        setIsEditing(false);
    };

    const toFromSpentReceived = watch('toFromSpentReceived');
    const transferTypeName = watch('cashTransfer.transfer_type');
    const destinationID = watch('cashTransfer.destination') || '';
    const sourceID = watch('cashTransfer.source') || '';
    const completedFirstStep = watch('completedFirstStep');

    const getDrawer = (drawerID: string | null) => {
        return (
            drawers.all.find((drawer) => drawer.drawer_id === drawerID) ||
            drivers.todays.find((driver) => driver.drawer_id === drawerID)
        );
    };

    const interpretCashTransfer = (cashTransfer: CashTransfer, drawerID: string) => {
        const { amount_in_cents, source, destination, transfer_type, title } = cashTransfer;
        const sourceName = getDrawer(source)?.name;
        const destinationName = getDrawer(destination)?.name;

        const index = drawerID === source ? 0 : 1;

        const drawerName = [sourceName, destinationName][index];

        const verb = [
            { bank: 'gave a bank of', payment: 'paid', other: 'spent' },
            { bank: 'received a bank of', payment: 'received a payment of', other: 'received' },
        ][index][transfer_type];

        const directObject = [
            {
                bank: `to ${destinationName}`,
                payment: `to ${destinationName}`,
                other: `on ${title} on behalf of the restaurant`,
            },
            {
                bank: `from ${sourceName}`,
                payment: `from ${sourceName}`,
                other: `from ${title} on behalf of the restaurant`,
            },
        ][index][transfer_type];

        return `${drawerName} ${verb} ${formatCurrency(amount_in_cents)} ${directObject}`;
    };

    const toFromSpentReceivedStack =
        cashTransfer && ['to', 'from'].includes(toFromSpentReceived) ? (
            <Typography variant="body1">
                {toFromSpentReceived === 'to' ? getDrawer(destinationID)?.name : getDrawer(sourceID)?.name}
            </Typography>
        ) : (
            <Typography variant="body1">{cashTransfer?.title}</Typography>
        );

    const arrowIcon = ['to', 'spent'].includes(toFromSpentReceived) ? <ArrowLeftIcon /> : <ArrowRightIcon />;

    if (!isEditing) {
        if (forNewCashTransfer) {
            return (
                <Button onClick={() => setIsEditing(true)} sx={{ width: '100%' }}>
                    New Cash Transfer
                </Button>
            );
        } else if (cashTransfer) {
            return (
                <LabeledStack
                    fixed
                    label={cashTransfer.title ?? cashTransfer.transfer_type}
                    direction="row"
                    spacing={2}
                    height={60}
                    alignItems="center"
                    justifyContent="space-evenly">
                    {toFromSpentReceivedStack}
                    {arrowIcon}
                    <Typography variant="body1">{formatCurrency(cashTransfer.amount_in_cents)}</Typography>
                    <IconButton onClick={() => setIsEditing(true)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <InfoPopover>{interpretCashTransfer(cashTransfer, drawerID)}</InfoPopover>
                </LabeledStack>
            );
        }
    }

    const validTFSRs = {
        bank: ['from'],
        payment: ['from', 'to'],
        other: ['from', 'to', 'received', 'spent'],
    }[transferTypeName];

    const allDriversAndDrawers: (Drawer | Driver_Drawer)[] = [...drawers.all, ...drivers.todays];

    const validDrawers = definedValues?.validDrawerFilter
        ? allDriversAndDrawers.filter(definedValues.validDrawerFilter)
        : allDriversAndDrawers.filter((drawer) => {
              // bank comes from 'register' and goes to 'driver'
              // payment goes from 'driver' to 'register' or from 'register' to 'driver'
              // other comes from 'driver'/'register' to null or from null to 'driver'/'register'
              if (drawer.drawer_id === drawerID) return false; // can't transfer to yourself
              if (transferTypeName === 'bank') {
                  if (toFromSpentReceived === 'from') {
                      return drawer.drawer_type === 'register';
                  } else if (toFromSpentReceived === 'to') {
                      return drawer.drawer_type === 'driver';
                  }
              } else if (transferTypeName === 'payment') {
                  return ['driver', 'register'].includes(drawer.drawer_type);
              } else if (transferTypeName === 'other') {
                  return true;
              }
              return false;
          });

    const transferTypeEditor = (
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            {toFromSpentReceived === 'to' ? (
                <Controller
                    key="destination"
                    name="cashTransfer.destination"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            value={allDriversAndDrawers.find((d) => d.drawer_id === value) || null}
                            options={validDrawers}
                            sx={{ width: 200 }}
                            disabled={!forNewCashTransfer}
                            onChange={(_, selectedOption) => onChange(selectedOption?.drawer_id || '')}
                            renderInput={(params) => (
                                <SmartTextField
                                    {...params}
                                    label={transferType === 'bank' ? 'Register' : 'Drawer'}
                                    error={!!errors.cashTransfer?.destination}
                                />
                            )}
                            getOptionLabel={(option) =>
                                allDriversAndDrawers.find((d) => d.drawer_id === option.drawer_id)?.name || ''
                            }
                        />
                    )}
                />
            ) : toFromSpentReceived === 'from' ? (
                <Controller
                    key="source"
                    name="cashTransfer.source"
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            value={allDriversAndDrawers.find((d) => d.drawer_id === value) || null}
                            options={validDrawers}
                            sx={{ width: 200 }}
                            disabled={!forNewCashTransfer}
                            onChange={(_, selectedOption) => onChange(selectedOption?.drawer_id || '')}
                            renderInput={(params) => (
                                <SmartTextField
                                    {...params}
                                    label={transferType === 'bank' ? 'Register' : 'Drawer'}
                                    error={!!errors.cashTransfer?.source}
                                />
                            )}
                            getOptionLabel={(option) =>
                                allDriversAndDrawers.find((d) => d.drawer_id === option.drawer_id)?.name || ''
                            }
                        />
                    )}
                />
            ) : (
                <SmartTextField
                    label="Title"
                    error={!!errors.cashTransfer?.title}
                    helperText={errors.cashTransfer?.title?.message}
                    {...register('cashTransfer.title', { required: transferType === 'other' && 'Title is required' })}
                />
            )}
            {validTFSRs.length > 1 ? (
                <Controller
                    name="toFromSpentReceived"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        const handleButtonClick = () => {
                            if (value === 'from') {
                                onChange('to');
                            } else if (value === 'to') {
                                onChange('from');
                            } else if (value === 'spent') {
                                onChange('received');
                            } else if (value === 'received') {
                                onChange('spent');
                            }
                            setValue('cashTransfer.destination', sourceID);
                            setValue('cashTransfer.source', destinationID);
                        };
                        return (
                            <Button variant="outlined" onClick={handleButtonClick}>
                                {arrowIcon}
                            </Button>
                        );
                    }}
                />
            ) : (
                <Button disabled variant="outlined">
                    {arrowIcon}
                </Button>
            )}
        </Stack>
    );

    if (!completedFirstStep) {
        const validTransferTypes = ['bank', 'payment', 'other'].filter(
            (transferType) => canCreateBankTransfer || transferType !== 'bank',
        ) as CashTransferType[];

        return (
            <Stack direction="column" rowGap={2} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Controller
                        name="cashTransfer.transfer_type"
                        control={control}
                        render={() => {
                            const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                                const value = e.currentTarget.value as CashTransferType;
                                let tsfr: 'to' | 'from' | 'spent' | 'received', source, destination;
                                if (value === 'bank') {
                                    tsfr = 'from';
                                    source = constants.default.register_for_bank_transfers;
                                    destination = drawerID;
                                } else if (value === 'payment') {
                                    tsfr = 'to';
                                    source = drawerID;
                                    destination = constants.default.register_for_cash_transfers;
                                } else {
                                    tsfr = 'spent';
                                    source = drawerID;
                                    destination = '';
                                }
                                // const tsfr = ['bank', 'payment'].includes(value) ? 'from' : 'spent';
                                // const source = ['bank', 'payment'].includes(value) ? '' : drawerID ;
                                // const destination = ['bank', 'payment'].includes(value) ? drawerID : '';
                                reset({
                                    cashTransfer: {
                                        amount_in_cents:
                                            value === 'bank' ? constants.default.driver_starting_cash_in_cents : 0,
                                        source,
                                        destination,
                                        business_date: businessDate.format('YYYY-MM-DD'),
                                        title: '',
                                        special_note: '',
                                        transfer_type: value,
                                    },
                                    toFromSpentReceived: tsfr,
                                    completedFirstStep: true,
                                });
                            };

                            return (
                                <ButtonGroup orientation="horizontal" fullWidth>
                                    {validTransferTypes.map((option) => {
                                        return (
                                            <Button
                                                onClick={handleButtonClick}
                                                variant="outlined"
                                                key={option}
                                                value={option}
                                                color="primary">
                                                {option}
                                            </Button>
                                        );
                                    })}
                                    <Button variant="outlined" color="error" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            );
                        }}
                    />
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack direction="column" rowGap={2} mt={2}>
            <LabeledStack
                label={forNewCashTransfer ? 'New Cash Transfer' : `Edit ${transferTypeName}`}
                direction="column"
                justifyContent="space-between"
                mt={1}
                rowGap={4}
                alignItems="center">
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    {transferTypeEditor}
                    <Controller
                        name="cashTransfer.amount_in_cents"
                        control={control}
                        rules={validators.payment.amount_in_cents}
                        render={({ field: { value } }) => {
                            return (
                                <TextFieldWithMask
                                    sx={{ minWidth: 100 }}
                                    label="Amount"
                                    maskVariant="currency"
                                    error={!!errors.cashTransfer?.amount_in_cents}
                                    helperText={errors.cashTransfer?.amount_in_cents?.message}
                                    value={value}
                                    handleChange={(value, shouldDirty) =>
                                        setValue('cashTransfer.amount_in_cents', value, { shouldDirty })
                                    }
                                    focused
                                />
                            );
                        }}
                    />
                    <ButtonGroup orientation="horizontal">
                        <motion.div whileHover={{ scale: 1.25 }}>
                            <IconButton onClick={handleCancel}>
                                <CancelIcon />
                            </IconButton>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.25 }}>
                            <IconButton onClick={handleSubmit(onSubmit)} color="success">
                                <SaveIcon />
                            </IconButton>
                        </motion.div>
                        {!forNewCashTransfer && (
                            <motion.div whileHover={{ scale: 1.25 }}>
                                <IconButton onClick={handleDeletionConfirmation} color="error">
                                    <DeleteForeverIcon />
                                </IconButton>
                            </motion.div>
                        )}
                    </ButtonGroup>
                </Stack>
            </LabeledStack>
        </Stack>
    );
};
