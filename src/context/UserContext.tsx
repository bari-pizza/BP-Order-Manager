import { createContext } from 'react';
import { SupashipUserInfo } from '../dataHooks/useSession';

export const UserContext = createContext<SupashipUserInfo>({
    session: null,
    profile: null,
});
