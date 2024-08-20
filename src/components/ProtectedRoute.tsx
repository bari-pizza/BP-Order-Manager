import React, { Suspense } from 'react';
import { useUserContext } from '../dataHooks/useContextData';
import { SmartNavigate } from './SmartNavigate';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { session } = useUserContext();

    if (!session) {
        return (
            <Suspense fallback={<div>Loading</div>}>
                <SmartNavigate redirect keepSearchParams to="/login" />
            </Suspense>
        );
    }

    return <>{children}</>;
};
