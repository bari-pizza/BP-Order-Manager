import { createContext } from 'react';
import { SupashipUserInfo } from '../hooks/data/useSession';

export const UserContext = createContext<SupashipUserInfo>({
    session: null,
    profile: null,
    loading: true,
});

// for dealing with user session and profile
