import { Suspense } from 'react';
import { useLayoutContext, useUserContext } from '../hooks/data/useContextData';
import { SmartNavigate } from './SmartNavigate';
import { Typography } from '@mui/material';

interface Protections {
    isLoggedIn?: boolean;
    isAdmin?: boolean;
    isManager?: boolean;
    isDesktop?: boolean;
}

const defaultProtections = {
    isLoggedIn: true,
};

export const ProtectedRoute = ({
    children,
    fallback,
    protections = defaultProtections,
    redirect = '/',
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    protections?: Protections;
    redirect?: string | false;
}) => {
    const { session, profile, loading } = useUserContext();
    const { isMobile } = useLayoutContext();

    const allProtections = { ...defaultProtections, ...protections };

    if (loading || (session?.user && !profile)) {
        return <>{fallback}</>;
    }

    if (allProtections.isLoggedIn && !session) {
        return <SmartNavigate redirect to="/login" />;
    }

    if (allProtections.isAdmin && !profile?.is_admin) {
        if (redirect) {
            return <SmartNavigate redirect keepSearchParams to={redirect} />;
        }
        return null;
    }

    if (allProtections.isManager && !profile?.is_manager) {
        if (redirect) {
            return <SmartNavigate redirect keepSearchParams to={redirect} />;
        }
        return null;
    }

    if (allProtections.isDesktop && isMobile) {
        return <Typography variant="body1">Please use a desktop or tablet to use this page.</Typography>;
    }

    return <Suspense fallback={fallback}>{children}</Suspense>;
};
