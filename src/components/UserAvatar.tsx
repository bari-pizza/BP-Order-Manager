import { Avatar, Skeleton } from '@mui/material';
import { useUserContext } from '../hooks/data/useContextData';

export const UserAvatar = () => {
    const { session, profile } = useUserContext();
    let userAvatar = <Skeleton variant="circular" height={30} width={30} />;
    if (profile) {
        const fullName = `${profile.first_name} ${profile.last_name}`;
        const initials = fullName
            .split(' ')
            .map((name) => name[0])
            .join('');
        userAvatar = <Avatar sx={{ height: 30, width: 30 }}>{initials}</Avatar>;
    }

    if (!session) {
        userAvatar = <Avatar sx={{ height: 30, width: 30 }} />;
    }

    return userAvatar;
};
