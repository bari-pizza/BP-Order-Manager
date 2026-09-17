import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';
import { DrawerCardBase } from './DrawerCardBase';
import { dummyDrawers } from '../../dummyData';

const register = dummyDrawers.drawers[0];
const thirdParty = dummyDrawers.drawers[2];
const driver = dummyDrawers.drivers[0];

const meta = {
    title: 'Shop/DrawerCard',
    component: DrawerCardBase,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        controls: { expanded: true },
    },
    args: {
        drawer: register,
        badgeCount: 3,
        isOpen: false,
        isLocked: false,
    },
    argTypes: {
        badgeCount: { control: { type: 'number', min: 0, max: 20 } },
        isOpen: { control: 'boolean' },
        isLocked: { control: 'boolean' },
        handleClick: { action: 'clicked' },
        drawer: {
            control: 'select',
            options: ['Register', 'Third Party', 'Driver'],
            mapping: {
                Register: register,
                'Third Party': thirdParty,
                Driver: driver,
            },
        },
        sx: { control: false },
        props: { control: false },
    },
} satisfies Meta<typeof DrawerCardBase>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom **Controls**: badge count, lock, which drawer. */
export const Playground: Story = {};

export const Row: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <DrawerCardBase drawer={register} badgeCount={5} />
            <DrawerCardBase drawer={thirdParty} badgeCount={1} />
            <DrawerCardBase drawer={driver} badgeCount={2} />
            <DrawerCardBase drawer={driver} badgeCount={0} isLocked />
        </Stack>
    ),
};
