import { useUserContext } from '../dataHooks/useContextData';
import { SmartNavigate } from './SmartNavigate';

export const ProtectedRoute = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
    const { session, loading } = useUserContext();

    if (loading) {
        return <>{fallback}</>;
    }

    if (!session) {
        return <SmartNavigate redirect keepSearchParams to="/login" />;
    }

    return <>{children}</>;
};
