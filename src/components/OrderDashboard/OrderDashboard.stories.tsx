import type { Meta, StoryObj } from '@storybook/react';

import { OrderDashboard } from './OrderDashboard';

const meta = {
  component: OrderDashboard,
} satisfies Meta<typeof OrderDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};