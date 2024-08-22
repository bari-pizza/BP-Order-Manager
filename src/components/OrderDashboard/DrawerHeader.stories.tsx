import type { Meta, StoryObj } from '@storybook/react';
// import { withBusinessDayContext } from '../../.storybook/preview.tsx';
import { DrawerHeader } from './DrawerHeader';

const meta = {
    component: DrawerHeader,
} satisfies Meta<typeof DrawerHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const NoDrivers: Story = {
    args: {},
    // decorators: [withBusinessDayContext],
};
