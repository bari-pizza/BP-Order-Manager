import type { Meta, StoryObj } from '@storybook/react';

import { DrawerCard } from './DrawerCard';
import { dummyDrawers } from '../../dummyData';

const meta = {
    component: DrawerCard,
} satisfies Meta<typeof DrawerCard>;

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
