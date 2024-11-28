import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useBariPizzaContext } from '../../../hooks/data/useContextData';
import { LabeledStack } from '../../../rickcedlib/components/LabeledStack';
import { TextFieldWithMask } from '../../../rickcedlib/components/TextFieldWithMask';
import { Autocomplete, Button } from '@mui/material';
import { SmartTextField } from '../../../rickcedlib/components/SmartTextField';

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
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            default_delivery_fee_in_cents: constants.default.delivery_fee_in_cents,
            default_driver_starting_cash: constants.default.driver_starting_cash_in_cents,
            default_driver_hourly_wage: constants.default.driver_hourly_wage_in_cents,
            default_register_starting_cash: constants.default.register_starting_cash_in_cents,
            default_register_for_bank_transfers: constants.default.register_for_bank_transfers,
            default_register_for_cash_transfers: constants.default.register_for_cash_transfers,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };
    return (
        <LabeledStack label="Settings" spacing={2} alignItems="center">
            <Controller
                name="default_delivery_fee_in_cents"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
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
                        renderInput={(params) => <SmartTextField {...params} label="Default Bank Register" />}
                        getOptionLabel={(option) => drawers.find((d) => d.drawer_id === option)?.name || ''}
                    />
                )}
            />
            {/* disabled until implemented */}
            <Button disabled onClick={handleSubmit(onSubmit)}>
                Save Changes
            </Button>
        </LabeledStack>
    );
};
