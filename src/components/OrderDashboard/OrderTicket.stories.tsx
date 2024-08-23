import type { Meta, StoryObj } from '@storybook/react';
import { OrderTicket } from './OrderTicket';
import { dummyOrders } from '../../dummyData';

const meta = {
    component: OrderTicket,
} satisfies Meta<typeof OrderTicket>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        order: dummyOrders.existing[0],
        collapsed: false,
        toggleCollapsed: () => {},
        selected: false,
        toggleSelected: () => {},
    },
};
