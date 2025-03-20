import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { LabeledStack } from '../../../rickcedlib/components/LabeledStack';
import { TextFieldWithMask } from '../../../rickcedlib/components/TextFieldWithMask';
import { Autocomplete, Button } from '@mui/material';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';
import { supaClient } from '../../../supaClient';
import { Id, toast } from 'react-toastify';
import { useRef } from 'react';

type FormValues = {
    default_delivery_fee_in_cents: number;
    default_driver_starting_cash: number;
    default_driver_hourly_wage: number;
    default_register_starting_cash: number;
    default_register_for_bank_transfers: string;
    default_register_for_cash_transfers: string;
};

export const SettingsTab = () => {
    const { constants, drawers } = useBariPizzaContext();
    const {
        control,
        handleSubmit,
        reset,
        formState: { dirtyFields, isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            default_delivery_fee_in_cents: constants.default.delivery_fee_in_cents,
            default_driver_starting_cash: constants.default.driver_starting_cash_in_cents,
            default_driver_hourly_wage: constants.default.driver_hourly_wage_in_cents,
            default_register_starting_cash: constants.default.register_starting_cash_in_cents,
            default_register_for_bank_transfers: constants.default.register_for_bank_transfers,
            default_register_for_cash_transfers: constants.default.register_for_cash_transfers,
        },
    });

    const toastRef = useRef<Id>('');

    const onSubmit: SubmitHandler<FormValues> = async (rawData) => {
        console.log(rawData);
        const settingsMap = {
            default_delivery_fee_in_cents: 'delivery_fee_in_cents',
            default_driver_starting_cash: 'driver_starting_cash_in_cents',
            default_driver_hourly_wage: 'driver_hourly_wage_in_cents',
            default_register_starting_cash: 'register_starting_cash_in_cents',
            default_register_for_bank_transfers: 'register_for_bank_transfers',
            default_register_for_cash_transfers: 'register_for_cash_transfers',
        };
        toastRef.current = toast.loading('Saving settings...');
        const updates = Object.entries(rawData)
            .filter(([key]) => {
                return dirtyFields[key as keyof FormValues];
            })
            .map(async ([key, value]) => {
                const settingName = settingsMap[key as keyof FormValues];
                if (!settingName) return null;

                const settingValue = typeof value === 'number' ? value.toString() : value;

                // Update the specific setting in the table
                const { error } = await supaClient
                    .from('AppSetting')
                    .update({ setting_value: settingValue })
                    .eq('setting_name', settingName);

                if (error) {
                    console.error(`Failed to update setting: ${settingName}`, error);
                    toast.update(toastRef.current, {
                        type: 'error',
                        render: `Could not update ${settingName}: ${error.message}`,
                        isLoading: false,
                        autoClose: 5000,
                    });
                    return null;
                }

                console.log(`Updated setting: ${settingName}`);
                return settingName;
            });

        await Promise.all(updates);
        toast.update(toastRef.current, {
            type: 'success',
            render: 'Settings saved successfully',
            isLoading: false,
            autoClose: 5000,
        });
        reset(rawData);
        /*
         [
  {
    "id": 1,
    "setting_name": "delivery_fee_in_cents",
    "setting_value": "400",
    "setting_type": "integer"
  },
  {
    "id": 2,
    "setting_name": "driver_starting_cash_in_cents",
    "setting_value": "2000",
    "setting_type": "integer"
  },
  {
    "id": 3,
    "setting_name": "driver_hourly_wage_in_cents",
    "setting_value": "500",
    "setting_type": "integer"
  },
  {
    "id": 4,
    "setting_name": "register_starting_cash_in_cents",
    "setting_value": "10000",
    "setting_type": "integer"
  },
  {
    "id": 5,
    "setting_name": "register_for_bank_transfers",
    "setting_value": "feb2fc5d-19bd-42ab-b16e-38f12c86ce6a",
    "setting_type": "text"
  },
  {
    "id": 6,
    "setting_name": "register_for_cash_transfers",
    "setting_value": "feb2fc5d-19bd-42ab-b16e-38f12c86ce6a",
    "setting_type": "text"
  }
]
         */
    };
    return (
        <LabeledStack label="Settings" spacing={2} alignItems="center" height="100%">
            <Controller
                name="default_delivery_fee_in_cents"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
                        isDirty={dirtyFields.default_delivery_fee_in_cents}
                        label="Default Delivery"
                        maskVariant="currency"
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            <Controller
                name="default_driver_starting_cash"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
                        isDirty={dirtyFields.default_driver_starting_cash}
                        label="Default Driver Starting Cash"
                        maskVariant="currency"
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            <Controller
                name="default_driver_hourly_wage"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
                        isDirty={dirtyFields.default_driver_hourly_wage}
                        label="Default Wage"
                        maskVariant="currency"
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            <Controller
                name="default_register_starting_cash"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
                        isDirty={dirtyFields.default_register_starting_cash}
                        label="Default Register Starting Cash"
                        maskVariant="currency"
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            <Controller
                name="default_register_for_bank_transfers"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        options={drawers
                            .filter((drawer) => drawer.drawer_type === 'register')
                            .map((drawer) => drawer.drawer_id)}
                        value={value}
                        sx={{ width: 225 }}
                        onChange={(_, drawerID) => onChange(drawerID || '')}
                        renderInput={(params) => (
                            <SmartTextField
                                {...params}
                                label="Default Bank Register"
                                isDirty={dirtyFields.default_register_for_bank_transfers}
                            />
                        )}
                        getOptionLabel={(option) => drawers.find((d) => d.drawer_id === option)?.name || ''}
                    />
                )}
            />
            <Button disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
                Save Changes
            </Button>
        </LabeledStack>
    );
};
