import { createContext } from 'react';
import { SupashipUserInfo } from './useSession';

export const UserContext = createContext<SupashipUserInfo>({
    session: null,
    profile: null,
});
