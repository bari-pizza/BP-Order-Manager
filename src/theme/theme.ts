import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#008764',
            light: '#05ffb945',
            dark: '#005E46',
        },
        secondary: {
            main: '#f54531',
            light: '#F76A5A',
            dark: '#AB3022',
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiTextField: {
            // Login passes its own autoComplete values, which override this default.
            defaultProps: {
                autoComplete: 'off',
            },
        },
        MuiDialogTitle: {
            // Message catalog stores lowercase titles ("add employee").
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                },
            },
        },
    },
};
