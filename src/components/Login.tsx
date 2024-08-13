import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { Dialog, DialogContent } from '@mui/material';
import { supaClient } from '../supaClient';

export function Login() {
    const [showModal, setShowModal] = useState(false);
    const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in');
    const { session } = useContext(UserContext);

    useEffect(() => {
        if (session?.user) {
            setShowModal(false);
        }
    }, [session]);

    return (
        <>
            <div className="flex m-4 place-items-center">
                <button
                    className="login-button"
                    onClick={() => {
                        setAuthMode('sign_in');
                        setShowModal(true);
                    }}>
                    Login
                </button>{' '}
                <span className="p-2"> or </span>{' '}
                <button
                    className="login-button"
                    onClick={() => {
                        setAuthMode('sign_up');
                        setShowModal(true);
                    }}>
                    Sign Up
                </button>
            </div>
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogContent>
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
                        view={authMode}
                    />
                    <button onClick={() => setShowModal(false)}>Close</button>
                </DialogContent>
            </Dialog>
        </>
    );
}
