import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { NavBar } from './NavBar';
import { LayoutContext } from '../context/LayoutContext';
import { UserContext } from '../context/UserContext';
import type { Profile } from '../typesAndValidators';
import { resourceSrc } from '../../.storybook/fixtures/resources';

type NavBarStoryArgs = {
    signedIn: boolean;
    isAdmin: boolean;
    isManager: boolean;
    isCashier: boolean;
    /** When false, UserAvatar shows the missing-avatar placeholder. */
    hasAvatar: boolean;
    isMobile: boolean;
};

const buildProfile = (args: NavBarStoryArgs): Profile => ({
    id: 'story-user',
    email: 'demo@baripizza.com',
    phone: null,
    first_name: args.isAdmin ? 'Admin' : args.isManager ? 'Manager' : 'Alex',
    last_name: 'Demo',
    is_admin: args.isAdmin,
    is_manager: args.isManager,
    is_cashier: args.isCashier,
    is_deleted: false,
    avatar_src: args.hasAvatar ? resourceSrc.missingAvatar : null,
    locale: 'en',
    last_active_at: null,
});

const meta = {
    title: 'Layout/NavBar',
    parameters: {
        layout: 'fullscreen',
        controls: { expanded: true },
    },
    args: {
        signedIn: true,
        isAdmin: true,
        isManager: true,
        isCashier: false,
        hasAvatar: true,
        isMobile: false,
    } satisfies NavBarStoryArgs,
    argTypes: {
        signedIn: { control: 'boolean', description: 'Session present. Off = login item only.' },
        isAdmin: { control: 'boolean', if: { arg: 'signedIn' }, description: 'Shows Admin nav item.' },
        isManager: { control: 'boolean', if: { arg: 'signedIn' }, description: 'Shows Manager nav item.' },
        isCashier: { control: 'boolean', if: { arg: 'signedIn' } },
        hasAvatar: {
            control: 'boolean',
            if: { arg: 'signedIn' },
            description: 'Profile has avatar_src (UserAvatar); off uses the placeholder path.',
        },
        isMobile: { control: 'boolean', description: 'Narrow rail (hides Admin/Manager).' },
    },
    render: (args) => {
        const profile = args.signedIn ? buildProfile(args) : null;
        return (
            <LayoutContext.Provider
                value={{
                    sideBarRef: { current: null },
                    setSideBarWidth: () => undefined,
                    sideBarSkeletonRef: { current: null },
                    setSideBarSkeletonWidth: () => undefined,
                    isMobile: args.isMobile,
                    isPWA: false,
                    isInstalledShell: false,
                    appShell: 'browser',
                }}>
                <UserContext.Provider
                    value={{
                        session: args.signedIn ? ({ user: { id: 'story-user' } } as never) : null,
                        profile,
                        loading: false,
                    }}>
                    <Box sx={{ height: '100vh', display: 'flex' }}>
                        <NavBar />
                    </Box>
                </UserContext.Provider>
            </LayoutContext.Provider>
        );
    },
} satisfies Meta<NavBarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Toggle signed-in + roles in Controls. Admin/Manager items only appear when those flags are on (and not mobile). */
export const Playground: Story = {};
