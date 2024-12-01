import React, { useCallback, useEffect, useState } from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { useRefMask, getCurrencyMaskGenerator } from 'react-hook-mask'; // Assuming you're using react-hook-mask
import { SmartTextField } from './SmartTextField';

const currencyMaskGenerator = getCurrencyMaskGenerator({
    prefix: '$',
    thousandSeparator: ',',
    centsSeparator: '.',
});

type TextFieldWithMaskProps = TextFieldProps & {
    maskVariant: 'currency' | 'phone' | 'text' | 'number';
    value: string | number;
    handleChange: (value: number, shouldDirty: boolean) => void;
    keepMask?: boolean;
    isDirty?: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
    // optional ref used for things like focusing the input
};

export const TextFieldWithMask = ({
    maskVariant,
    value: initialValue,
    handleChange,
    keepMask = false,
    inputRef,
    isDirty,
    ...props
}: TextFieldWithMaskProps) => {
    const [value, setValue] = useState(initialValue + '');

    // Get and set cursor position to maintain cursor location after masking
    const getCursorPosition = useCallback((el?: HTMLInputElement) => el?.selectionStart ?? 0, []);
    const setCursorPosition = useCallback((cursorPosition: number, el?: HTMLInputElement) => {
        if (el && el.setSelectionRange) {
            el.setSelectionRange(cursorPosition, cursorPosition);
        }
    }, []);

    useEffect(() => {
        if (value !== initialValue + '') {
            setValue(initialValue + '');
        }
    }, [initialValue, value]);

    const maskGenerator = maskVariant === 'currency' ? currencyMaskGenerator : undefined;

    const { displayValue, setDisplayValue, ref } = useRefMask({
        value,
        maskGenerator,
        getCursorPosition,
        setCursorPosition,
        onChange: (maskedValue) => {
            setValue(maskedValue);
            const shouldDirty = initialValue !== Number(maskedValue);
            handleChange(Number(maskedValue), shouldDirty);
        },
        keepMask,
        ref: inputRef,
    });

    return (
        <SmartTextField
            {...props}
            // sx={sx}
            value={displayValue}
            isDirty={isDirty}
            onChange={(e) => setDisplayValue(e.target.value)}
            ref={ref} // Attach masked ref
        />
    );
};

export default TextFieldWithMask;
