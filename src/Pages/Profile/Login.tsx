import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supaClient } from '../supaClient';
import { SmartNavigate } from './SmartNavigate';
import { useUserContext } from '../hooks/data/useContextData';

type LoginProps = {
    authMode: 'sign_in' | 'sign_up';
};

export function Login({ authMode = 'sign_in' }: LoginProps) {
    const { session } = useUserContext();

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

    return <SmartNavigate keepSearchParams to="/" />;
}

// TODO: make this pretter
