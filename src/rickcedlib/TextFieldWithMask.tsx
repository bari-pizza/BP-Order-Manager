import React, { useCallback, useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useRefMask, getCurrencyMaskGenerator } from 'react-hook-mask'; // Assuming you're using react-hook-mask

const currencyMaskGenerator = getCurrencyMaskGenerator({
    prefix: '$ ',
    thousandSeparator: ',',
    centsSeparator: '.',
});

type TextFieldWithMaskProps = TextFieldProps & {
    maskVariant: 'currency' | 'phone' | 'text' | 'number';
    value: string | number;
    onChange: (value: string) => void;
    keepMask?: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
    // optional ref used for things like focusing the input
};

export const TextFieldWithMask = ({
    maskVariant,
    value: initialValue,
    onChange: externalOnChange,
    keepMask = false,
    inputRef,
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
            externalOnChange(maskedValue); // Call onChange prop passed from outside
        },
        keepMask,
        ref: inputRef,
    });

    return (
        <TextField
            {...props}
            value={displayValue}
            onChange={(e) => setDisplayValue(e.target.value)}
            inputRef={ref} // Attach masked ref
        />
    );
};

export default TextFieldWithMask;
