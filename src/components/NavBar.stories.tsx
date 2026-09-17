import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { NavBar } from './NavBar';
import { LayoutContext } from '../context/LayoutContext';
import { UserContext } from '../context/UserContext';
import type { Profile } from '../typesAndValidators';

const managerProfile: Profile = {
    id: 'story-manager',
    email: 'manager@example.com',
    phone: null,
    first_name: 'Alex',
    last_name: 'Manager',
    is_admin: true,
    is_manager: true,
    is_cashier: false,
    is_deleted: false,
    avatar_src: null,
    locale: 'en',
};

const meta = {
    title: 'Layout/NavBar',
    component: NavBar,
    parameters: {
        layout: 'fullscreen',
        controls: { disable: true },
    },
    decorators: [
        (Story) => (
            <LayoutContext.Provider
                value={{
                    sideBarRef: { current: null },
                    setSideBarWidth: () => undefined,
                    sideBarSkeletonRef: { current: null },
                    setSideBarSkeletonWidth: () => undefined,
                    isMobile: false,
                    isPWA: false,
                }}>
                <UserContext.Provider
                    value={{
                        session: { user: { id: managerProfile.id } } as never,
                        profile: managerProfile,
                        loading: false,
                    }}>
                    <Box sx={{ height: '100vh', display: 'flex' }}>
                        <Story />
                    </Box>
                </UserContext.Provider>
            </LayoutContext.Provider>
        ),
    ],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedInManager: Story = {};

export const SignedOut: Story = {
    decorators: [
        (Story) => (
            <LayoutContext.Provider
                value={{
                    sideBarRef: { current: null },
                    setSideBarWidth: () => undefined,
                    sideBarSkeletonRef: { current: null },
                    setSideBarSkeletonWidth: () => undefined,
                    isMobile: false,
                    isPWA: false,
                }}>
                <UserContext.Provider value={{ session: null, profile: null, loading: false }}>
                    <Box sx={{ height: '100vh', display: 'flex' }}>
                        <Story />
                    </Box>
                </UserContext.Provider>
            </LayoutContext.Provider>
        ),
    ],
};
