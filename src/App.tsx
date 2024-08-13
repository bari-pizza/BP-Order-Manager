import { Suspense, useRef } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClientProvider, QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Stack, Drawer } from '@mui/material';
import { useSession } from './useSession';
import {NavBar} from './components/NavBar';
// import { APIProvider } from '@vis.gl/react-google-maps';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import './App.css';
import { LayoutContext } from './LayoutContext.tsx';
import { UserContext } from './UserContext.tsx';
import { Session } from '@supabase/supabase-js';
import { Profile } from './supabaseQueries.ts';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '*',
                element: <div>Not Found</div>,
            },
        ],
    },
]);

function App() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </Suspense>
        </ErrorBoundary>
    );
}

export default App;

const queryClient = new QueryClient();

const drawerWidth = 350;

function Layout() {
    useSession();
    // const supashipUserInfo = useSession();
    const { data: session } = useSuspenseQuery({
        queryKey: ['session'],
        queryFn: () => queryClient.getQueryData(['session']) as Session | null,
        initialData: null,
    });
    const { data: profile } = useSuspenseQuery({
        queryKey: ['profiles', { id: session?.user.id }],
        queryFn: () => queryClient.getQueryData(['profiles', { id: session?.user.id }]) as Profile,
        initialData: null,
    });
    const sideBarRef = useRef<HTMLDivElement>(null);
    return (
        // <APIProvider
        //     apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        //     onLoad={() => console.log('Maps API has loaded.')}
        //     solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        //     version="beta">
        //     <LocalizationProvider dateAdapter={AdapterDayjs}>
                <LayoutContext.Provider value={{ sideBarRef }}>
                    <UserContext.Provider value={{ session, profile }}>
                        <Stack id="main" mt={2} direction="row" gap={2} justifyContent="center">
                            <NavBar />
                            <Stack id="content" direction="column" overflow="auto">
                                <Outlet />
                            </Stack>
                            <Drawer
                                sx={{
                                    width: drawerWidth,
                                    flexShrink: 0,
                                    '& .MuiDrawer-paper': {
                                        width: drawerWidth,
                                        boxSizing: 'border-box',
                                    },
                                }}
                                PaperProps={{ sx: { justifyContent: 'center', alignItems: 'center' } }}
                                id="sidebar-drawer"
                                anchor="right"
                                variant="permanent">
                                <Stack id="sidebar" direction="column" ref={sideBarRef} />
                            </Drawer>
                        </Stack>
                    </UserContext.Provider>
                </LayoutContext.Provider>
        //     </LocalizationProvider>
        // </APIProvider>
    );
}
