import { useNavigate } from 'react-router-dom';
import { Stack, Button } from '@mui/material';
import { supaClient } from '../supaClient';

export const MyAccount = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        supaClient.auth.signOut();
        navigate('/');
    };

    return (
        <Stack direction="column" alignItems="center" justifyContent="center" height="100vh">
            <Button onClick={handleLogout}>Logout</Button>
        </Stack>
    );
};
