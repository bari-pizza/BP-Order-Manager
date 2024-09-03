import type { Meta, StoryObj } from '@storybook/react';
import { OrderTicketArea } from './OrderTicketArea';

const meta = {
    component: OrderTicketArea,
} satisfies Meta<typeof OrderTicketArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
