import { useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Stack, Drawer } from '@mui/material';
import { NavBar } from './components/NavBar';
// import { APIProvider } from '@vis.gl/react-google-maps';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import './App.css';
import { LayoutContext } from './context/LayoutContext.tsx';
import { UserContext } from './context/UserContext.tsx';
import { useSession } from './useSession.ts';
import { OrderDashboard } from './components/OrderDashboard/OrderDashboard.tsx';
import { PageMissing } from './components/PageMissing.tsx';
import { Home } from './components/Home.tsx';
import { MyAccount } from './components/MyAccount.tsx';
import { Login } from './components/Login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

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
                    <ProtectedRoute>
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

function Layout() {
    const { session, profile } = useSession();
    const sideBarRef = useRef<HTMLDivElement>(null);
    const [sideBarWidth, setSideBarWidth] = useState<number | string>(0);
    return (
        // <APIProvider
        //     apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        //     onLoad={() => console.log('Maps API has loaded.')}
        //     solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        //     version="beta">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <LayoutContext.Provider value={{ sideBarRef, setSideBarWidth }}>
                <UserContext.Provider value={{ session, profile }}>
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
                    </Stack>
                </UserContext.Provider>
            </LayoutContext.Provider>
        </LocalizationProvider>
        // </APIProvider>
    );
}
