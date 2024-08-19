import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supaClient } from '../supaClient';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../dataHooks/useUserContext';

type LoginProps = {
    authMode: 'sign_in' | 'sign_up';
};

export function Login({ authMode = 'sign_in' }: LoginProps) {
    const { session } = useUserContext();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    console.log('sent here from:', location.state?.from?.pathname);

    if (!session) {
        return (
            <Auth
                supabaseClient={supaClient}
                appearance={{
                    theme: ThemeSupa,
                    className: {
                        container: 'login-form-container',
                        label: 'login-form-label',
                        button: 'login-form-button',
                        input: 'login-form-input',
                    },
                }}
                theme="dark"
                view={authMode}
            />
        );
    }

    console.log('session found, redirecting to:', from);

    return <Navigate to={from} replace />;
}
