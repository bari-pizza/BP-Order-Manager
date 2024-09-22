import { Stack, Button, Typography } from '@mui/material';
import { supaClient } from '../../supaClient';
import { useUserContext } from '../../hooks/data/useContextData';
import { SmartNavigate } from '../../components/SmartNavigate';
import { Todo } from '../../components/Base/Todo';
import { AvatarUploader } from './AvatarUploader';

// TODO: Add a way to edit profile (avatar_src, first_name, last_name,  password)

export const MyAccount = () => {
    const { session, profile } = useUserContext();

    const handleLogout = async () => {
        supaClient.auth.signOut();
    };

    if (!session) {
        return <SmartNavigate keepSearchParams to="/" />;
    }

    return (
        <Stack direction="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h3">My Account</Typography>
            <AvatarUploader profile={profile} />
            <Todo message="Should include avatar, first_name, last_name, & phone">Add a way to edit profile</Todo>
            <Button onClick={handleLogout}>Logout</Button>
        </Stack>
    );
};
