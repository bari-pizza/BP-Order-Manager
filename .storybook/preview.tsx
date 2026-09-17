import React from 'react';
import type { Preview } from '@storybook/react';
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { bariPizzaContextDecorators } from './contextDecorators';
import { themeOptions } from '../src/theme/theme';

const theme = createTheme(themeOptions);

const withAppProviders = (Story: () => React.ReactNode) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <QueryClientProvider client={queryClient}>
                <Story />
            </QueryClientProvider>
        </LocalizationProvider>
    </ThemeProvider>
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
            expanded: true,
        },
        layout: 'centered',
        options: {
            storySort: {
                order: ['Foundation', 'Shop', 'Layout', 'Pages'],
            },
        },
        reactRouter: reactRouterParameters({ location: { pathParams: {}, searchParams: {} } }),
    },
    decorators: [withRouter, withAppProviders, bariPizzaContextDecorators.default],
};

export default preview;
