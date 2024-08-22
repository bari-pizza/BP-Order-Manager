import type { Meta, StoryObj } from '@storybook/react';

import { DrawerAvatar } from './DrawerAvatar';

const meta = {
    component: DrawerAvatar,
} satisfies Meta<typeof DrawerAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        drawer: {
            drawer_id: 'feb2fc5d-19bd-42ab-b16e-38f12c86ce6a',
            created_at: '2024-08-13T01:45:22.015413+00:00',
            name: 'Drawer 1',
            drawer_type: 'register',
        },
    },
};
