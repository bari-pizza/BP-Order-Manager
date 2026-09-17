import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { OriginLogo } from './OriginLogo';
import { useBariPizzaContext } from '../../hooks/data/useContextData';

const meta = {
    title: 'Shop/OriginLogo',
    component: OriginLogo,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
} satisfies Meta<typeof OriginLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Logos resolve from BariPizzaContext resources (in-house vs third-party fallback). */
export const FromContext: Story = {
    // Required by Meta typing; render ignores it and reads origins from context.
    args: {
        orderOrigin: {
            origin_id: 'origin-in-house',
            name: 'Bari Pizza',
            icon: null,
            is_third_party: false,
            can_deliver: true,
            can_tip: true,
            has_order_number: true,
            is_prepaid_toggleable: true,
            default_is_prepaid: false,
            is_deleted: false,
        },
    },
    render: () => {
        const { origins } = useBariPizzaContext();
        return (
            <Stack spacing={2}>
                {origins.map((origin) => (
                    <Stack key={origin.origin_id} direction="row" spacing={2} alignItems="center">
                        <OriginLogo orderOrigin={origin} />
                        <Typography variant="body2">
                            {origin.name}
                            {origin.is_third_party ? ' (third party)' : ' (in-house)'}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        );
    },
};
