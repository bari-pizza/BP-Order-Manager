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
    /** Employee with a driver drawer — no extra nav items, but signed-in profile still shows. */
    isDriver: boolean;
    isMobile: boolean;
};

const buildProfile = (args: NavBarStoryArgs): Profile => ({
    id: 'story-user',
    email: 'demo@baripizza.com',
    phone: null,
    first_name: args.isAdmin ? 'Admin' : args.isManager ? 'Manager' : args.isDriver ? 'Driver' : 'Alex',
    last_name: 'Demo',
    is_admin: args.isAdmin,
    is_manager: args.isManager,
    is_cashier: args.isCashier,
    is_deleted: false,
    avatar_src: args.isDriver ? null : resourceSrc.missingAvatar,
    locale: 'en',
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
        isDriver: false,
        isMobile: false,
    } satisfies NavBarStoryArgs,
    argTypes: {
        signedIn: { control: 'boolean', description: 'Session present. Off = login item only.' },
        isAdmin: { control: 'boolean', if: { arg: 'signedIn' }, description: 'Shows Admin nav item.' },
        isManager: { control: 'boolean', if: { arg: 'signedIn' }, description: 'Shows Manager nav item.' },
        isCashier: { control: 'boolean', if: { arg: 'signedIn' } },
        isDriver: {
            control: 'boolean',
            if: { arg: 'signedIn' },
            description: 'Signed-in employee (no extra nav items beyond Orders).',
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
