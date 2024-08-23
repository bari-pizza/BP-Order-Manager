import type { Meta, StoryObj } from '@storybook/react';
import { OrderEditor } from './OrderEditor';
import { useArgs } from '@storybook/preview-api';
import { dummyOrders } from '../../../dummyData';

const meta = {
    component: OrderEditor,
} satisfies Meta<typeof OrderEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Render(args: any) {
    const [, updateArgs] = useArgs();

    function setOpen() {
        updateArgs({ open: !open });
    }

    return <OrderEditor {...args} setOpen={setOpen} />;
}

export const Default: Story = {
    args: {
        open: true,
        setOpen: () => {},
        order: undefined,
        asDialog: false,
    },
    render: Render,
};

export const Dialog: Story = {
    args: {
        open: true,
        setOpen: () => {},
        order: undefined,
        asDialog: true,
    },

    render: Render,
};

export const Edit: Story = {
    args: {
        open: true,
        setOpen: () => {},
        order: dummyOrders.existing[0],
        asDialog: false,
    },
    render: Render,
};

export const EditDialog: Story = {
    args: {
        open: true,
        setOpen: () => {},
        order: dummyOrders.existing[0],
        asDialog: true,
    },
    render: Render,
};
