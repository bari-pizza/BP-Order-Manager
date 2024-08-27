import { useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClientProvider, QueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { Stack, Drawer } from '@mui/material';
import { NavBar } from './components/NavBar';
// import { APIProvider } from '@vis.gl/react-google-maps';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './theme/theme.ts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import './App.css';
import { LayoutContext } from './context/LayoutContext.tsx';
import { UserContext } from './context/UserContext.tsx';
import { useSession } from './hooks/data/useSession.ts';
import { OrderDashboard, OrderDashboardSkeleton } from './components/OrderDashboard/OrderDashboard.tsx';
import { PageMissing } from './components/PageMissing.tsx';
import { Home } from './components/Home.tsx';
import { MyAccount } from './components/MyAccount.tsx';
import { Login } from './components/Login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { getAllDrawers, getAllDrivers, getAllOrigins } from './supabaseQueries.ts';
import { BusinessDayContext } from './context/BusinessDayContext.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '*',
                element: <PageMissing />,
            },
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/orders',
                element: (
                    <ProtectedRoute fallback={<OrderDashboardSkeleton />}>
                        <OrderDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/login',
                element: <Login authMode="sign_in" />,
            },
            {
                path: '/myaccount',
                element: <MyAccount />,
            },
        ],
    },
]);

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;

const queryClient = new QueryClient();

const theme = createTheme(themeOptions);

function Layout() {
    const { session, profile, loading } = useSession();
    const sideBarRef = useRef<HTMLDivElement>(null);
    const sideBarSkeletonRef = useRef<HTMLDivElement>(null);
    const [sideBarWidth, setSideBarWidth] = useState<number | string>(0);
    const [sideBarSkeletonWidth, setSideBarSkeletonWidth] = useState<number | string>(0);
    const [{ data: drawers }, { data: drivers }, { data: origins }] = useSuspenseQueries({
        queries: [
            {
                queryKey: ['drawers'],
                queryFn: getAllDrawers,
                staleTime: 1000 * 60 * 30,
                gcTime: 1000 * 60 * 30,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['drivers'],
                queryFn: getAllDrivers,
                staleTime: 1000 * 60 * 1,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['origins'],
                queryFn: getAllOrigins,
                staleTime: 1000 * 60 * 30,
                refetchOnWindowFocus: false,
            },
        ],
    });
    return (
        // <APIProvider
        //     apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        //     onLoad={() => console.log('Maps API has loaded.')}
        //     solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        //     version="beta">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <BusinessDayContext.Provider value={{ drawers, drivers, origins }}>
                    <LayoutContext.Provider
                        value={{ sideBarRef, setSideBarWidth, sideBarSkeletonRef, setSideBarSkeletonWidth }}>
                        <UserContext.Provider value={{ session, profile, loading }}>
                            <Stack id="main" direction="row" justifyContent="center">
                                <NavBar />
                                <Stack id="content" direction="column" overflow="auto" width={'100%'}>
                                    <Outlet />
                                </Stack>
                                <Drawer
                                    sx={{
                                        width: sideBarWidth,
                                        flexShrink: 0,
                                        '& .MuiDrawer-paper': {
                                            width: sideBarWidth,
                                            boxSizing: 'border-box',
                                        },
                                    }}
                                    id="sidebar-drawer"
                                    anchor="right"
                                    variant="permanent">
                                    <Stack id="sidebar" direction="column" ref={sideBarRef} sx={{ height: '100vh' }} />
                                </Drawer>
                                <Drawer
                                    sx={{
                                        width: sideBarSkeletonWidth,
                                        flexShrink: 0,
                                        '& .MuiDrawer-paper': {
                                            width: sideBarSkeletonWidth,
                                            boxSizing: 'border-box',
                                        },
                                    }}
                                    id="sidebar-skeleton-drawer"
                                    anchor="right"
                                    variant="permanent">
                                    <Stack
                                        id="sidebar-skeleton"
                                        direction="column"
                                        ref={sideBarSkeletonRef}
                                        sx={{ height: '100vh' }}
                                    />
                                </Drawer>
                            </Stack>
                        </UserContext.Provider>
                    </LayoutContext.Provider>
                </BusinessDayContext.Provider>
            </ThemeProvider>
        </LocalizationProvider>
        // </APIProvider>
    );
}
