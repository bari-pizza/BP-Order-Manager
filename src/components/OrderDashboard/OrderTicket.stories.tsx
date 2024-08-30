import type { Args, Meta, StoryObj } from '@storybook/react';
import { OrderTicket } from './OrderTicket';
import { dummyOrders } from '../../dummyData';
import { useState } from 'react';

const meta = {
    component: OrderTicket,
} satisfies Meta<typeof OrderTicket>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: Args) => {
    const [collapsed, setCollapsed] = useState(args.collapsed);
    const [selected, setSelected] = useState(args.selected);
    const toggleCollapsed = () => {
        setCollapsed((prev: boolean) => !prev);
    };
    const toggleSelected = () => {
        setSelected((prev: boolean) => !prev);
    };
    return (
        <OrderTicket
            order={args.order}
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            selected={selected}
            toggleSelected={toggleSelected}
        />
    );
};

export const Default: Story = {
    args: {
        order: dummyOrders.existing[0],
        collapsed: false,
        toggleCollapsed: () => {},
        selected: false,
        toggleSelected: () => {},
    },
    render: Template,
};
