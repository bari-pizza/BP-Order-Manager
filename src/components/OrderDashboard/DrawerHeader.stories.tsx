import type { Meta, StoryObj } from '@storybook/react';
import { DrawerHeader } from './DrawerHeader';
import { businessDayContextDecorators } from '../../../.storybook/contextDecorators';

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
    decorators: [businessDayContextDecorators.noDrivers],
};
