import type { Meta, StoryObj } from '@storybook/react';
import { OrderTicket } from './OrderTicket';
import { dummyOrders } from '../../dummyData';
import { useState } from 'react';

const meta = {
    component: OrderTicket,
} satisfies Meta<typeof OrderTicket>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
    const [collapsed, setCollapsed] = useState(args.collapsed);
    const [selected, setSelected] = useState(args.selected);
    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };
    const toggleSelected = () => {
        setSelected((prev) => !prev);
    };
    return (
        <OrderTicket
            {...args}
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
