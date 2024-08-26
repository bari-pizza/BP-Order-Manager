import { Suspense } from 'react';
import { useUserContext } from '../hooks/data/useContextData';
import { SmartNavigate } from './SmartNavigate';

export const ProtectedRoute = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
    const { session, loading } = useUserContext();

    if (loading) {
        return <>{fallback}</>;
    }

    if (!session) {
        return <SmartNavigate redirect keepSearchParams to="/login" />;
    }

    return <Suspense fallback={fallback}>{children}</Suspense>;
};
