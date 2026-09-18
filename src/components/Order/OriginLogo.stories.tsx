import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { OriginLogo } from './OriginLogo';
import { storyOrigins } from '../../../.storybook/fixtures/resources';

const originOptions = {
    'Bari Pizza (in-house)': storyOrigins.bariPizza,
    DoorDash: storyOrigins.doorDash,
    Pizzamico: storyOrigins.pizzamico,
    'Unknown third-party (Default Origin fallback)': storyOrigins.unknownThirdParty,
} as const;

const meta = {
    title: 'Shop/OriginLogo',
    component: OriginLogo,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        controls: { expanded: true },
    },
    args: {
        orderOrigin: storyOrigins.bariPizza,
    },
    argTypes: {
        orderOrigin: {
            control: 'select',
            options: Object.keys(originOptions),
            mapping: originOptions,
            description: 'Which origin — in-house uses Bari Pizza resource; third-party uses icon or Default Origin.',
        },
    },
} satisfies Meta<typeof OriginLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom Controls → pick an origin. Unknown third-party shows the Default Origin fallback. */
export const Playground: Story = {};

export const AllOrigins: Story = {
    parameters: { controls: { disable: true } },
    render: () => (
        <Stack spacing={2}>
            {Object.values(storyOrigins).map((origin) => (
                <Stack key={origin.origin_id} direction="row" spacing={2} alignItems="center">
                    <OriginLogo orderOrigin={origin} />
                    <Typography variant="body2">
                        {origin.name}
                        {origin.is_third_party
                            ? origin.icon
                                ? ' (third party)'
                                : ' (third party → Default Origin)'
                            : ' (in-house)'}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    ),
};
