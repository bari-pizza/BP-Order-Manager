import { Navigate, useLocation } from 'react-router-dom';
import React, { Suspense } from 'react';
import { useUserContext } from '../dataHooks/useContextData';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { session } = useUserContext();
    const location = useLocation();

    if (!session) {
        return (
            <Suspense fallback={<div>Loading</div>}>
                <Navigate to="/login" replace state={{ from: location }} />;
            </Suspense>
        );
    }

    return <>{children}</>;
};
