import type { Meta, StoryObj } from '@storybook/react';
import { OrderEditor } from './OrderEditor';
import { useArgs } from '@storybook/preview-api';
import { dummyOrders } from '../../../dummyData';

const meta = {
    component: OrderEditor,
    parameters: { layout: 'centered' },
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
        isOpen: true,
        close: () => {},
        order: undefined,
        asDialog: false,
    },
    render: Render,
};

export const Dialog: Story = {
    args: {
        isOpen: true,
        close: () => {},
        order: undefined,
        asDialog: true,
    },

    render: Render,
};

export const Edit: Story = {
    args: {
        isOpen: true,
        close: () => {},
        order: dummyOrders.one.existing(),
        asDialog: false,
    },
    render: Render,
};

export const EditDialog: Story = {
    args: {
        isOpen: true,
        close: () => {},
        order: dummyOrders.one.existing(),
        asDialog: true,
    },
    render: Render,
};
