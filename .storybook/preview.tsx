import React from 'react';
import type { Preview } from '@storybook/react';
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { bariPizzaContextDecorators } from './contextDecorators';

const withLocalizationProvider = (storyFn: () => React.ReactNode) => {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>{storyFn()}</LocalizationProvider>;
};

const queryClient = new QueryClient();

const withQueryClient = (storyFn: () => React.ReactNode) => {
    return <QueryClientProvider client={queryClient}>{storyFn()}</QueryClientProvider>;
};

// TODO: create a decorator to provide theme options

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        reactRouter: reactRouterParameters({ location: { pathParams: {}, searchParams: {} } }),
    },
    decorators: [withRouter, withQueryClient, bariPizzaContextDecorators.default, withLocalizationProvider],
};

export default preview;
