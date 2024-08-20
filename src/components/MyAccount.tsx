import { Stack, Button } from '@mui/material';
import { supaClient } from '../supaClient';
import { useUserContext } from '../dataHooks/useContextData';
import { SmartNavigate } from './SmartNavigate';

export const MyAccount = () => {
    const { session } = useUserContext();

    const handleLogout = async () => {
        supaClient.auth.signOut();
    };

    if (!session) {
        return <SmartNavigate keepSearchParams to="/" />;
    }

    return (
        <Stack direction="column" alignItems="center" justifyContent="center" height="100vh">
            <Button onClick={handleLogout}>Logout</Button>
        </Stack>
    );
};
