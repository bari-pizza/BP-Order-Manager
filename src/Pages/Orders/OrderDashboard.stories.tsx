import type { Meta, StoryObj } from '@storybook/react';

import { OrderDashboard } from './OrderDashboard';

import { dummyOrders } from '../../dummyData';

const meta = {
    component: OrderDashboard,
} satisfies Meta<typeof OrderDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithOrders: Story = {
    args: {
        orders: dummyOrders.existing(10),
    },
};
