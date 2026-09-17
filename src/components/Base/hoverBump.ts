export const BUMP_TRANSFORM = 'translateY(-2px) scale(1.06)';
export const BUMP_SHADOW = '0 4px 8px rgba(0, 0, 0, 0.25)';
export const BUMP_TRANSITION = 'transform 180ms ease-out, box-shadow 180ms ease-out';

/**
 * Lift an avatar *and* anything layered on it (badges) together when the surrounding
 * .lottie-icon-container is hovered. Put this on the outermost Badge so the count and
 * lock badges travel with the avatar instead of staying put.
 */
export const hoverBumpSx = {
    transition: 'transform 180ms ease-out',
    '& .MuiAvatar-root': { transition: 'box-shadow 180ms ease-out' },
    '.lottie-icon-container:hover &': {
        transform: BUMP_TRANSFORM,
        '& .MuiAvatar-root': { boxShadow: BUMP_SHADOW },
    },
    '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '.lottie-icon-container:hover &': {
            transform: 'none',
            '& .MuiAvatar-root': { boxShadow: 'none' },
        },
    },
};
