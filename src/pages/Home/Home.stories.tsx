import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Home } from './Home';
import { LayoutContext } from '../../context/LayoutContext';

const phoneViewport = {
    name: 'iPhone 13',
    styles: { width: '390px', height: '844px' },
    type: 'mobile' as const,
};

const meta = {
    title: 'Pages/Home',
    component: Home,
    parameters: {
        layout: 'fullscreen',
        controls: { disable: true },
    },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
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
                <Box sx={{ height: '100vh', width: '100%' }}>
                    <Story />
                </Box>
            </LayoutContext.Provider>
        ),
    ],
};

/**
 * Sets both `isMobile` (picks the mobile Lottie) and a phone viewport so the canvas
 * is portrait — otherwise the mobile animation looks crushed in a wide iframe.
 */
export const Mobile: Story = {
    parameters: {
        viewport: {
            viewports: { iphone13: phoneViewport },
            defaultViewport: 'iphone13',
        },
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <LayoutContext.Provider
                value={{
                    sideBarRef: { current: null },
                    setSideBarWidth: () => undefined,
                    sideBarSkeletonRef: { current: null },
                    setSideBarSkeletonWidth: () => undefined,
                    isMobile: true,
                    isPWA: false,
                }}>
                <Box
                    sx={{
                        width: 390,
                        height: 844,
                        overflow: 'hidden',
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}>
                    <Story />
                </Box>
            </LayoutContext.Provider>
        ),
    ],
};
