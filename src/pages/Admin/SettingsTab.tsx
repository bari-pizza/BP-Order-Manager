import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { LabeledStack } from '../../rickcedlib/LabeledStack';
// import { NumericFormatCustom } from '../../rickcedlib/MaskedTextField';
// import { NumericFormat, PatternFormat } from 'react-number-format';
// import { NumericFormatCustom } from '../../rickcedlib/MaskedTextField';
// import { useState } from 'react';
// import InputMask from 'react-input-mask';
import { TextFieldWithMask } from '../../rickcedlib/MaskedTextField';
import { useRef } from 'react';
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
    const inputRef = useRef<HTMLInputElement>(null);

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
                        label="Default Delivery Fee"
                        maskVariant="currency"
                        value={value}
                        onChange={onChange}
                        inputRef={inputRef}
                    />
                )}
            />
            <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
        </LabeledStack>
    );
};
