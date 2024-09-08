import { Avatar, Skeleton } from '@mui/material';
import { useUserContext } from '../../hooks/data/useContextData';

const avatarSX = {
    height: 35,
    width: 35,
    bgcolor: 'primary.main',
    border: '3px solid',
    borderColor: 'primary.main',
};

export const UserAvatar = () => {
    const { session, profile } = useUserContext();
    let userAvatar = <Skeleton variant="circular" height={30} width={30} />;
    if (profile) {
        const fullName = `${profile.first_name} ${profile.last_name}`;
        const initials = fullName
            .split(' ')
            .map((name) => name[0])
            .join('');
        userAvatar = (
            <Avatar sx={avatarSX} src="https://mui.com/static/images/avatar/2.jpg">
                {initials}
            </Avatar>
        );
    }

    if (!session) {
        userAvatar = <Avatar sx={avatarSX} />;
    }

    return userAvatar;
};
