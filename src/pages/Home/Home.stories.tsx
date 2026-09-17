import type { Meta, StoryObj } from '@storybook/react';
import { Home } from './Home';
import { LayoutContext } from '../../context/LayoutContext';

const meta = {
    title: 'Pages/Home',
    component: Home,
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
                <Story />
            </LayoutContext.Provider>
        ),
    ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
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
                <Story />
            </LayoutContext.Provider>
        ),
    ],
};
