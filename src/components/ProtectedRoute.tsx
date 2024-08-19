import { Navigate, useLocation } from 'react-router-dom';
import React, { Suspense, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { session } = useContext(UserContext);
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
