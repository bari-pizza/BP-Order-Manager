import type { Meta, StoryObj } from '@storybook/react';

import { DrawerAvatar } from './DrawerAvatar';
import { dummyDrawers } from '../../dummyData';

const meta = {
    component: DrawerAvatar,
} satisfies Meta<typeof DrawerAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        drawer: dummyDrawers.drawers[0],
    },
};

export const Driver: Story = {
    args: {
        drawer: dummyDrawers.drivers[0],
    },
};
