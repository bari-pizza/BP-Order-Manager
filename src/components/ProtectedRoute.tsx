import { Suspense } from 'react';
import { useUserContext } from '../hooks/data/useContextData';
import { SmartNavigate } from './SmartNavigate';

interface Protections {
    isLoggedIn?: boolean;
    isAdmin?: boolean;
    isManager?: boolean;
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

    const allProtections = { ...defaultProtections, ...protections };

    if (loading) {
        return <>{fallback}</>;
    }

    if (allProtections.isLoggedIn && !session) {
        return <SmartNavigate redirect to="/login" />;
    }

    // TODO: create a page for this
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

    return <Suspense fallback={fallback}>{children}</Suspense>;
};
