import { useEffect, useMemo, useRef, useState, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
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
import { OrderDashboardSkeleton } from './pages/Orders/OrderDashboardSkeleton.tsx';
import { PageMissing } from './components/PageMissing.tsx';
import { Home } from './pages/Home/Home.tsx';
import { MyAccount } from './pages/Profile/MyAccount.tsx';
import { MyAccountSkeleton } from './pages/Profile/MyAccountSkeleton.tsx';
import { Login } from './pages/Profile/Login.tsx';
import { HowTo } from './pages/HowTo/HowTo.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { getAllAppSettings, getAllDrawers, getAllDrivers, getAllOrigins, getAllResources } from './supabaseQueries.ts';
import { BariPizzaContext } from './context/BariPizzaContext.tsx';
import { AdminDashboardSkeleton } from './pages/Admin/AdminDashboardSkeleton.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ManagerDashboardSkeleton } from './pages/Manager/ManagerDashboardSkeleton.tsx';
import { UnderConstruction } from './UnderConstruction.tsx';
import { useMediaQuery } from 'usehooks-ts';
import { useSetupAllSubscriptions } from './hooks/data/useSubscribeToTable.tsx';
import { useBusinessDate, useMidnightEffect } from './hooks/data/useBusinessDate.tsx';
import { enUS, ptBR, esES, Localization } from '@mui/material/locale';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
// @ts-expect-error missing module declaration
import { setLocale } from './paraglide/runtime.js';
import { toast } from './toast/toastWrapper.tsx';

// // Lazy load components
const OrderDashboard = lazy(() =>
    import('./pages/Orders/OrderDashboard').then((module) => ({
        default: module.OrderDashboard,
    })),
);
const AdminDashboard = lazy(() =>
    import('./pages/Admin/AdminDashboard').then((module) => ({
        default: module.AdminDashboard,
    })),
);
const ManagerDashboard = lazy(() =>
    import('./pages/Manager/ManagerDashboard').then((module) => ({
        default: module.ManagerDashboard,
    })),
);

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ErrorBoundary>
                <Layout />
            </ErrorBoundary>
        ),
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
                path: '/how-to',
                element: (
                    <ProtectedRoute fallback={<MyAccountSkeleton />}>
                        <HowTo />
                    </ProtectedRoute>
                ),
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
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </QueryClientProvider>
    );
}

export default App;

const queryClient = new QueryClient();

// const theme = createTheme(themeOptions);

function Layout() {
    const { session, profile, loading } = useSession();
    const sideBarRef = useRef<HTMLDivElement>(null);
    const sideBarSkeletonRef = useRef<HTMLDivElement>(null);
    const [sideBarWidth, setSideBarWidth] = useState<number | string>(0);
    const [sideBarSkeletonWidth, setSideBarSkeletonWidth] = useState<number | string>(0);
    const isMobile = useMediaQuery(
        '(max-width: 800px) and (orientation: portrait), (max-width: 600px) and (orientation: landscape)',
    );
    const isPWA = useMediaQuery('(display-mode: standalone)');
    useMidnightEffect();
    // MAYBE include useSubscribeToTable here but these shouldnt be changed often
    const [{ data: drawers }, { data: drivers }, { data: origins }, { data: constants }, { data: resources }] =
        useSuspenseQueries({
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
                {
                    queryKey: ['resources'],
                    queryFn: getAllResources,
                    staleTime: 1000 * 60 * 30,
                    refetchOnWindowFocus: false,
                },
            ],
        });
    const [businessDate] = useBusinessDate();

    const profileLocale = profile?.locale || 'en';

    const { theme, dayJsLocale } = useMemo(() => {
        if (profileLocale) {
            const dictionary: {
                [languageCode: string]: {
                    dayJSLocale: string;
                    localization: Localization;
                    text: string;
                };
            } = {
                es: { dayJSLocale: 'es-us', localization: esES, text: 'Español' },
                pt: { dayJSLocale: 'pt-br', localization: ptBR, text: 'Português' },
                en: { dayJSLocale: 'en', localization: enUS, text: 'English' },
            };
            const theme = createTheme(themeOptions, dictionary[profileLocale].localization);
            const dayJsLocale = dictionary[profileLocale].dayJSLocale;
            return { theme, dayJsLocale };
        } else {
            const theme = createTheme(themeOptions, enUS);
            return { theme, dayJsLocale: 'en' };
        }
    }, [profileLocale]);

    useMemo(() => {
        dayjs.locale(dayJsLocale);
    }, [dayJsLocale]);

    useEffect(() => {
        // using profile?.locale here instead of profileLocale so that it only runs once profile is loaded
        if (profile?.locale) {
            setLocale(profile?.locale);
        }
    }, [profile?.locale]);

    useSetupAllSubscriptions({ businessDate, showToast: ['insert', 'update'], isMobile });

    useEffect(() => {
        if (isMobile && !isPWA) {
            toast.error('Please install the app for better experience', {
                autoClose: false,
            });
        }
    }, [isMobile, isPWA]);

    return (
        // <APIProvider
        //     apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        //     onLoad={() => console.log('Maps API has loaded.')}
        //     solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        //     version="beta">

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayJsLocale}>
            <ThemeProvider theme={theme}>
                <BariPizzaContext.Provider
                    value={{
                        drawers,
                        drivers: drivers.sort((a, b) => a.name.localeCompare(b.name)),
                        origins,
                        constants,
                        resources,
                    }}>
                    <LayoutContext.Provider
                        value={{
                            sideBarRef,
                            setSideBarWidth,
                            sideBarSkeletonRef,
                            setSideBarSkeletonWidth,
                            isMobile,
                            isPWA,
                        }}>
                        <UserContext.Provider value={{ session, profile, loading }}>
                            <ToastContainer />
                            <Stack
                                id="main"
                                direction="row"
                                height="100vh"
                                justifyContent="center"
                                className={isMobile ? 'for-mobile' : ''}>
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
