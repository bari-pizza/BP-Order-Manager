// import { Avatar, Skeleton } from '@mui/material';
import { useUserContext } from '../../hooks/data/useContextData';
import { RoundLottieIcon } from '../../rickcedlib/LottieIcons';

// const avatarSX = {
//     height: 35,
//     width: 35,
//     bgcolor: 'primary.main',
//     border: '3px solid',
//     borderColor: 'primary.main',
// };

// export const UserAvatar = () => {
//     const { session, profile } = useUserContext();
//     let userAvatar = <Skeleton variant="circular" height={30} width={30} />;
//     if (profile) {
//         const fullName = `${profile.first_name} ${profile.last_name}`;
//         const initials = fullName
//             .split(' ')
//             .map((name) => name[0])
//             .join('');
//         userAvatar = (
//             <Avatar sx={avatarSX} src={profile.avatar_src || ''}>
//                 {initials}
//             </Avatar>
//         );
//     }

//     if (!session) {
//         userAvatar = <Avatar sx={avatarSX} />;
//     }

//     return userAvatar;
// };

export const UserAvatar = () => {
    const { session, profile } = useUserContext();
    if (profile) {
        return <RoundLottieIcon imageSrc={profile.avatar_src || ''} />;
    }

    if (!session) {
        return <RoundLottieIcon imageSrc="" />;
    }
};
