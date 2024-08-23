import type { Meta, StoryObj } from '@storybook/react';
import { OrderTicketArea } from './OrderTicketArea';
import { dummyOrders } from '../../../dummyData';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
    component: OrderTicketArea,
} satisfies Meta<typeof OrderTicketArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOrders = dummyOrders.existing.slice(0, 10);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Render(args: any) {
    const [, updateArgs] = useArgs();

    function toggleTicket() {
        const collapsedTickets = args.collapsedTickets.slice();

        if (collapsedTickets.includes(args.order.order_id)) {
            updateArgs({ collapsedTickets: collapsedTickets.filter((id: string) => id !== args.order.order_id) });
        } else {
            collapsedTickets.push(args.order.order_id);
            updateArgs({ collapsedTickets });
        }
    }

    return <OrderTicketArea {...args} toggleTicket={toggleTicket} />;
}

export const Default: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: [],
        toggleCollapsedTicket: () => {},
        selectedTickets: [],
        toggleSelectedTicket: () => {},
    },
    render: Render,
};

export const CollapsedStories: Story = {
    args: {
        orders: defaultOrders,
        collapsedTickets: defaultOrders.map((order) => order.order_id),
        toggleCollapsedTicket: () => {},
        selectedTickets: [],
        toggleSelectedTicket: () => {},
    },
    render: Render,
};
