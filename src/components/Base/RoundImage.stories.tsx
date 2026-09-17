import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography, Paper, Badge, Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { RoundImage } from './RoundImage';
import { hoverBumpSx } from './hoverBump';
import avatarImage from '../../assets/add-user.png';

const meta = {
    title: 'Base/RoundImage',
    component: RoundImage,
} satisfies Meta<typeof RoundImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover to compare the bump against a static avatar, at each size the app uses. */
export const Bump: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack spacing={4} padding={3}>
            <Typography variant="h6">Hover each avatar</Typography>
            <Stack direction="row" spacing={8} alignItems="center">
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={avatarImage} alt="static" size="xlarge" variant="border" />
                    <Typography variant="subtitle2">static</Typography>
                </Stack>
                <Stack spacing={1} alignItems="center">
                    <RoundImage src={avatarImage} alt="bump" size="xlarge" variant="border" bump />
                    <Typography variant="subtitle2">bump</Typography>
                </Stack>
            </Stack>

            <Typography variant="h6">At the sizes actually used</Typography>
            {(['small', 'medium', 'large'] as const).map((size) => (
                <Stack key={size} direction="row" spacing={8} alignItems="center">
                    <Typography variant="body2" width={60}>
                        {size}
                    </Typography>
                    <RoundImage src={avatarImage} alt={`${size} static`} size={size} variant="border" />
                    <RoundImage src={avatarImage} alt={`${size} bump`} size={size} variant="border" bump />
                </Stack>
            ))}
        </Stack>
    ),
};

/**
 * Resource rows ship with an empty src until someone uploads one, so this is what dev
 * currently looks like. It must not render a broken image.
 */
export const MissingImageFallback: Story = {
    args: { src: '', alt: 'Unassigned' },
    render: () => (
        <Stack spacing={3} padding={3}>
            <Typography variant="h6">Empty or broken src</Typography>
            <Stack direction="row" spacing={6} alignItems="center">
                {[
                    { src: '', alt: 'Unassigned', label: 'empty src' },
                    { src: '', alt: 'Test Driver1', label: 'empty src, driver' },
                    { src: 'https://example.invalid/nope.png', alt: 'DoorDash', label: 'broken url' },
                ].map(({ src, alt, label }) => (
                    <Stack key={label} spacing={1} alignItems="center" width={140}>
                        <RoundImage src={src} alt={alt} size="large" variant="border" />
                        <Typography variant="caption" textAlign="center">
                            {label}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
            <Typography variant="h6">Fallback at every size</Typography>
            <Stack direction="row" spacing={6} alignItems="center">
                {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                    <RoundImage key={size} src="" alt="Unassigned" size={size} variant="border" />
                ))}
            </Stack>
        </Stack>
    ),
};

/**
 * The OrdersTable cell: a row of avatar + svg icon + text. The avatar must sit on the same
 * centre line as the icon and the text, and keep its ring.
 */
export const InTableRow: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack spacing={2} padding={3}>
            {[
                { label: 'with image', src: avatarImage },
                { label: 'fallback', src: '' },
            ].map(({ label, src }) => (
                <Stack
                    key={label}
                    direction="row"
                    alignItems="center"
                    height={52}
                    spacing={2}
                    sx={{ borderBottom: '1px solid #eee', width: 320 }}>
                    <RoundImage
                        src={src}
                        alt="Bari Pizza"
                        variant="border"
                        style={{ height: '25px', width: '25px', borderWidth: '2px', flexShrink: 0 }}
                    />
                    <DirectionsCarIcon color="primary" />
                    <span>1</span>
                    <Typography variant="body2" color="text.secondary">
                        {label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    ),
};

/**
 * DrawerCardBase sizes its avatar as `height: 4em`, which must resolve against the button's
 * inherited font size. Guards against the avatar collapsing if Avatar's own font-size wins.
 */
export const SizedInEm: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack direction="row" spacing={3} padding={3}>
            {[
                { label: 'with image', src: avatarImage },
                { label: 'fallback', src: '' },
            ].map(({ label, src }) => (
                <Button
                    key={label}
                    variant="outlined"
                    className="lottie-icon-container"
                    sx={{ height: 175, width: 100 }}>
                    <Stack alignItems="center" gap={1}>
                        <Badge badgeContent={2} color="error" overlap="circular" sx={hoverBumpSx}>
                            <RoundImage
                                src={src}
                                alt="Drawer 1"
                                style={{ height: '4em', width: '4em', border: '4px solid #00875A' }}
                            />
                        </Badge>
                        <Typography variant="body2">{label}</Typography>
                    </Stack>
                </Button>
            ))}
        </Stack>
    ),
};

/**
 * Real-world trigger: hovering anywhere on the card lifts the avatar *and* its badges,
 * because the badge wrapper carries hoverBumpSx. This is how drawer cards behave.
 */
export const HoverFromParentCard: Story = {
    args: { src: avatarImage, alt: 'sample avatar' },
    render: () => (
        <Stack spacing={3} padding={3}>
            <Typography variant="h6">Hover anywhere on the card</Typography>
            <Stack direction="row" spacing={3}>
                <Paper
                    className="lottie-icon-container"
                    elevation={3}
                    sx={{ padding: 3, width: 170, textAlign: 'center', cursor: 'pointer' }}>
                    <Stack spacing={1} alignItems="center">
                        <Badge badgeContent={1} color="error" overlap="circular" sx={hoverBumpSx}>
                            <RoundImage src={avatarImage} alt="badged" size="large" variant="border" />
                        </Badge>
                        <Typography variant="subtitle2">badge lifts too</Typography>
                    </Stack>
                </Paper>
                <Paper
                    className="lottie-icon-container"
                    elevation={3}
                    sx={{ padding: 3, width: 170, textAlign: 'center', cursor: 'pointer' }}>
                    <Stack spacing={1} alignItems="center">
                        <Badge badgeContent={1} color="error" overlap="circular" sx={hoverBumpSx}>
                            <RoundImage src="" alt="Unassigned" size="large" variant="border" />
                        </Badge>
                        <Typography variant="subtitle2">fallback, badged</Typography>
                    </Stack>
                </Paper>
                <Paper
                    className="lottie-icon-container"
                    elevation={3}
                    sx={{ padding: 3, width: 170, textAlign: 'center', cursor: 'pointer' }}>
                    <Stack spacing={1} alignItems="center">
                        <RoundImage src={avatarImage} alt="static" size="large" variant="border" />
                        <Typography variant="subtitle2">static, as in tables</Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    ),
};
