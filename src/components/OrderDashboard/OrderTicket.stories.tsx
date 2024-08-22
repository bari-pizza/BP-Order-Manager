import type { Meta, StoryObj } from '@storybook/react';

import { OrderTicket } from './OrderTicket';
import { createDummyOrder } from '../../dummyData';

const meta = {
    component: OrderTicket,
} satisfies Meta<typeof OrderTicket>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        order: createDummyOrder(),
        collapsed: false,
        toggleCollapsed: () => {},
    },
};
