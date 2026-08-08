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
    const { resources } = useBariPizzaContext();
    const { session, profile } = useUserContext();
    if (profile) {
        if (profile.avatar_src) {
            return <RoundLottieIcon imageSrc={profile.avatar_src} />;
        }
        const resource = resources.find((resource) => resource.title === 'Missing Avatar');
        if (resource) {
            return <RoundLottieIcon imageSrc={resource.src!} />;
        }
        return null;
    }

    if (!session) {
        return <RoundLottieIcon imageSrc="" />;
    }
};
