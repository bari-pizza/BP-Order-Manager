import type { Args, Meta, StoryObj } from '@storybook/react';
import { OrderTicketArea } from './OrderTicketArea';
import { dummyOrders } from '../../../dummyData';
import { useState } from 'react';
import { Order } from '../../../typesAndValidators';

const meta = {
    component: OrderTicketArea,
} satisfies Meta<typeof OrderTicketArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOrders = dummyOrders.existing.slice(0, 10);

const Template = (args: Args) => {
    const [collapsedTickets, setCollapsedTickets] = useState(args.collapsedTickets);
    const [selectedTickets, setSelectedTickets] = useState(args.selectedTickets);
    const toggleCollapsedTicket = (order: Order) => {
        setCollapsedTickets((prev: string[]) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((ticket) => ticket !== order.order_id);
            } else {
                return [...prev, order.order_id];
            }
        });
    };
    const toggleSelectedTicket = (order: Order) => {
        setSelectedTickets((prev: string[]) => {
            if (prev.includes(order.order_id)) {
                return prev.filter((ticket) => ticket !== order.order_id);
            } else {
                return [...prev, order.order_id];
            }
        });
    };
    return (
        <OrderTicketArea
            orders={args.orders}
            collapsedTickets={collapsedTickets}
            toggleCollapsedTicket={toggleCollapsedTicket}
            selectedTickets={selectedTickets}
            toggleSelectedTicket={toggleSelectedTicket}
        />
    );
};

export const Default: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: [],
        toggleCollapsedTicket: () => {},
        selectedTickets: [],
        toggleSelectedTicket: () => {},
    },
    render: Template,
};

export const CollapsedStories: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: defaultOrders.map((order) => order.order_id),
        toggleCollapsedTicket: () => {},
        selectedTickets: [],
        toggleSelectedTicket: () => {},
    },
    render: Template,
};
