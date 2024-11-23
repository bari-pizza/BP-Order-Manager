import { TextField, TextFieldProps, useTheme } from '@mui/material';
// import to merge sx
import { deepmerge } from '@mui/utils';
import { forwardRef } from 'react';

type SmartTextFieldProps = TextFieldProps & {
    isDirty?: boolean;
};

// export const SmartTextField = ({ isDirty, ...props }: SmartTextFieldProps) => {
export const SmartTextField = forwardRef<HTMLInputElement, SmartTextFieldProps>(({ isDirty, ...props }, ref) => {
    const theme = useTheme();
    if (isDirty) {
        if (!props.sx) props.sx = {};
        props.sx = deepmerge(props.sx, {
            '& .MuiOutlinedInput-root': {
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                    backgroundColor: theme.palette.primary.light,
                    borderColor: theme.palette.primary.main,
                },
            },
            '& .MuiInputLabel-root.MuiInputLabel-outlined': {
                color: theme.palette.primary.main,
            },
        });
    }
    return <TextField {...props} ref={ref} />;
});
