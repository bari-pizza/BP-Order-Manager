import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Home } from './Home';
import { LayoutContext } from '../../context/LayoutContext';
import { shopViewports, type ShopViewportKey } from '../../../.storybook/viewports';

type HomeStoryArgs = {
    device: ShopViewportKey;
};

const meta = {
    title: 'Pages/Home',
    parameters: {
        layout: 'centered',
        controls: { expanded: true },
    },
    args: {
        device: 'iphone13',
    } satisfies HomeStoryArgs,
    argTypes: {
        device: {
            control: 'select',
            options: Object.keys(shopViewports),
            description:
                'Cycle devices here, or use the viewport toolbar (phone icon). Mobile Lottie is used below ~800px width.',
        },
    },
    render: ({ device }) => {
        const vp = shopViewports[device];
        const width = parseInt(vp.styles.width, 10);
        const height = parseInt(vp.styles.height, 10);
        // Match App.tsx media roughly: portrait phones use the mobile Lottie.
        const isMobile = vp.type === 'mobile';

        return (
            <LayoutContext.Provider
                value={{
                    sideBarRef: { current: null },
                    setSideBarWidth: () => undefined,
                    sideBarSkeletonRef: { current: null },
                    setSideBarSkeletonWidth: () => undefined,
                    isMobile,
                    isPWA: false,
                }}>
                <Box
                    sx={{
                        width,
                        height,
                        overflow: 'hidden',
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: isMobile ? '24px' : 1,
                    }}>
                    <Home />
                </Box>
            </LayoutContext.Provider>
        );
    },
} satisfies Meta<HomeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls → device. Also: Storybook toolbar → viewport icon to resize the whole canvas.
 * Mobile Lottie is 1550×4025 (very tall) — empty sky above the shop is the art, not a bug.
 */
export const Playground: Story = {};

export const Desktop: Story = {
    args: { device: 'laptop' },
};

export const Mobile: Story = {
    args: { device: 'iphone13' },
};
