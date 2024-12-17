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
import { OrderDashboard, OrderDashboardSkeleton } from './pages/Orders/OrderDashboard.tsx';
import { PageMissing } from './components/PageMissing.tsx';
import { Home } from './pages/Home/Home.tsx';
import { MyAccount, MyAccountSkeleton } from './pages/Profile/MyAccount.tsx';
import { Login } from './pages/Profile/Login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { getAllAppSettings, getAllDrawers, getAllDrivers, getAllOrigins } from './supabaseQueries.ts';
import { BariPizzaContext } from './context/BariPizzaContext.tsx';
import { AdminDashboard, AdminDashboardSkeleton } from './pages/Admin/AdminDashboard.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ManagerDashboard, ManagerDashboardSkeleton } from './pages/Manager/ManagerDashboard.tsx';
import { UnderConstruction } from './UnderConstruction.tsx';
import { useMediaQuery } from 'usehooks-ts';

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
                path: '/search',
                element: <UnderConstruction />,
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
                element: <Login />,
            },
            {
                path: '/myaccount',
                element: (
                    <ProtectedRoute fallback={<MyAccountSkeleton />}>
                        <MyAccount />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/admin',
                element: (
                    <ProtectedRoute
                        fallback={<AdminDashboardSkeleton />}
                        protections={{ isAdmin: true }}
                        redirect="/denied">
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/manager',
                element: (
                    <ProtectedRoute
                        fallback={<ManagerDashboardSkeleton />}
                        protections={{ isManager: true, isDesktop: true }}
                        redirect="/denied">
                        <ManagerDashboard />
                    </ProtectedRoute>
                ),
            },
            { path: '/denied', element: <div>Access Denied!</div> },
        ],
    },
]);

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider
                    router={router}
                    future={{
                        v7_startTransition: true,
                    }}
                />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
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
    const isMobile = useMediaQuery(
        '(max-width: 800px) and (orientation: portrait), (max-width: 600px) and (orientation: landscape)',
    );
    // MAYBE include useSubscribeToTable here but these shouldnt be changed often
    const [{ data: drawers }, { data: drivers }, { data: origins }, { data: constants }] = useSuspenseQueries({
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
                staleTime: 1000 * 60 * 30,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['origins'],
                queryFn: getAllOrigins,
                staleTime: 1000 * 60 * 30,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['constants'],
                queryFn: getAllAppSettings,
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
                <BariPizzaContext.Provider
                    value={{
                        drawers,
                        drivers: drivers.sort((a, b) => a.name.localeCompare(b.name)),
                        origins,
                        constants,
                    }}>
                    <LayoutContext.Provider
                        value={{ sideBarRef, setSideBarWidth, sideBarSkeletonRef, setSideBarSkeletonWidth, isMobile }}>
                        <UserContext.Provider value={{ session, profile, loading }}>
                            <ToastContainer
                                style={{
                                    width: 'maxContent',
                                    justifyContent: 'right',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                }}
                            />
                            <Stack id="main" direction="row" justifyContent="center">
                                <NavBar />
                                <Stack id="content" direction="column" overflow="auto" width={'100%'}>
                                    <Outlet />
                                </Stack>
                                {!isMobile && (
                                    <>
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
                                            <Stack
                                                id="sidebar"
                                                direction="column"
                                                ref={sideBarRef}
                                                sx={{ height: '100vh' }}
                                            />
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
                                    </>
                                )}
                            </Stack>
                        </UserContext.Provider>
                    </LayoutContext.Provider>
                </BariPizzaContext.Provider>
            </ThemeProvider>
        </LocalizationProvider>
        // </APIProvider>
    );
}
