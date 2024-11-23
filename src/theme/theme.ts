import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
    // components: {
    //     MuiTextField: {
    //         variants: [
    //             {
    //                 props: { isDirty: true }, // Custom prop handling
    //                 style: {
    //                     '& .MuiOutlinedInput-root': {
    //                         '& fieldset.MuiOutlinedInput-notchedOutline': {
    //                             backgroundColor: '#05ffb945',
    //                             borderColor: '#008764',
    //                         },
    //                     },
    //                     '& .MuiInputLabel-root.MuiInputLabel-outlined': {
    //                         color: '#008764',
    //                     },
    //                 },
    //             },
    //         ],
    //     },
    // },
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
        error: {
            main: '#f54531',
            light: '#F76A5A',
            dark: '#AB3022',
        },
        warning: {
            main: '#f54531',
            light: '#F76A5A',
            dark: '#AB3022',
        },
        info: {
            main: '#f54531',
            light: '#F76A5A',
            dark: '#AB3022',
        },
        success: {
            main: '#f54531',
            light: '#F76A5A',
            dark: '#AB3022',
        },
    },
};
