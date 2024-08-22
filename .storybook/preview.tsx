import React from 'react';
import type { Preview } from '@storybook/react';
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BusinessDayContext } from '../src/context/BusinessDayContext';
import { Drawer, DriverDrawer } from '../src/supabaseQueries';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const drawers: Drawer[] = [
    {
        drawer_id: 'feb2fc5d-19bd-42ab-b16e-38f12c86ce6a',
        created_at: '2024-08-13T01:45:22.015413+00:00',
        name: 'Drawer 1',
        drawer_type: 'register',
    },
    {
        drawer_id: '4590a732-d422-4413-aa33-9539f7f45f54',
        created_at: '2024-08-13T01:45:33.864466+00:00',
        name: 'Drawer 2',
        drawer_type: 'register',
    },
    {
        drawer_id: 'da9cc0c9-5e1e-4c25-adcf-190286ebf560',
        created_at: '2024-08-13T01:45:49.369411+00:00',
        name: 'Third Party Pickup',
        drawer_type: 'third_party',
    },
];
const drivers: DriverDrawer[] = [
    {
        name: 'Cedrick Catalan',
        drawer_id: '8e0e8b9c-568e-4caa-8343-e65195988c15',
        created_at: '2024-08-13T19:52:07.219674+00:00',
        drawer_type: 'driver',
        driver: {
            id: '643ba61f-168a-4a62-840c-0cd3fc57eba8',
            email: null,
            phone: null,
            last_name: 'Catalan',
            first_name: 'Cedrick',
        },
    },
];

const withLocalizationProvider = (storyFn: () => React.ReactNode) => {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>{storyFn()}</LocalizationProvider>;
};

// TODO: created a more general decorator that takes values to be injected in the context
export const withBusinessDayContext = (storyFn: () => React.ReactNode) => {
    return (
        <BusinessDayContext.Provider
            value={{
                drawers,
                drivers,
            }}>
            {storyFn()}
        </BusinessDayContext.Provider>
    );
};

const queryClient = new QueryClient();

const withQueryClient = (storyFn: () => React.ReactNode) => {
    return <QueryClientProvider client={queryClient}>{storyFn()}</QueryClientProvider>;
};

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
    decorators: [withRouter, withQueryClient, withBusinessDayContext, withLocalizationProvider],
};

export default preview;
