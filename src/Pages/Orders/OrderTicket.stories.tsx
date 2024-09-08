import type { Meta, StoryObj } from '@storybook/react';
import { OrderTicket } from './OrderTicket';
import { dummyOrders } from '../../dummyData';
import { useState } from 'react';
import { OrderOrigin, OrderType } from '../../typesAndValidators';

type OrderTicketAndCustomArgs = React.ComponentProps<typeof OrderTicket> & {
    origin: OrderOrigin['name'];
    orderType: OrderType;
};

const meta: Meta<OrderTicketAndCustomArgs> = {
    component: OrderTicket,
} satisfies Meta<typeof OrderTicket>;

export default meta;

type Story = StoryObj<OrderTicketAndCustomArgs>;

const Template = (args: OrderTicketAndCustomArgs) => {
    const [collapsed, setCollapsed] = useState(args.collapsed);
    const [selected, setSelected] = useState(args.selected);
    const toggleCollapsed = () => {
        setCollapsed((prev: boolean) => !prev);
    };
    const toggleSelected = () => {
        setSelected((prev: boolean) => !prev);
    };

    const order = {
        ...args.order,
        order_type: args.orderType,
        origin: args.origin,
    };

    return (
        <OrderTicket
            order={order}
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            selected={selected}
            toggleSelected={toggleSelected}
        />
    );
};

export const Default: Story = {
    args: {
        order: dummyOrders.one.existing(),
        collapsed: false,
        toggleCollapsed: () => {},
        selected: false,
        toggleSelected: () => {},
    },
    argTypes: {
        origin: {
            options: ['Bari Pizza', 'DoorDash', 'Pizzamico'] as OrderOrigin['name'][],
            control: { type: 'select' },
        },
        order: {
            control: false,
        },
    },
    render: Template,
};

//TODO: finish fixing controls and rendering (missing icons and doesnt collapse or select)
