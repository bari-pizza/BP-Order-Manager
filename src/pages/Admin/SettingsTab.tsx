import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { LabeledStack } from '../../rickcedlib/LabeledStack';
import { TextFieldWithMask } from '../../rickcedlib/TextFieldWithMask';
import { Button } from '@mui/material';

type FormValues = {
    default_delivery_fee_in_cents: number;
};

export const SettingsTab = () => {
    const { constants } = useBariPizzaContext();
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            default_delivery_fee_in_cents: constants.default.delivery_fee_in_cents,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };
    return (
        <LabeledStack label="Settings">
            <Controller
                name="default_delivery_fee_in_cents"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextFieldWithMask
                        label="Default Delivery"
                        maskVariant="currency"
                        value={value}
                        onChange={onChange}
                        keepMask={true}
                    />
                )}
            />
            <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
        </LabeledStack>
    );
};
