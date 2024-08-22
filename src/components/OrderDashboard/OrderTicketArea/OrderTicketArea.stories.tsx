import type { Meta, StoryObj } from '@storybook/react';

import { OrderTicketArea } from './OrderTicketArea';
import { createDummyOrder } from '../../../dummyData';

const meta = {
    component: OrderTicketArea,
} satisfies Meta<typeof OrderTicketArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map(() => createDummyOrder({ isNew: false }))
    .sort((a, b) => (a?.order_number || 0) - (b?.order_number || 0));

export const Default: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: [],
        toggleTicket: () => {},
    },
};

export const CollapsedStories: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: defaultOrders.map((order) => order.order_id),
        toggleTicket: () => {},
    },
};
