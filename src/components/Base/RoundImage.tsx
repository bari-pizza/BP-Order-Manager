import { Avatar, useTheme } from '@mui/material';
import { BUMP_SHADOW, BUMP_TRANSFORM, BUMP_TRANSITION } from './hoverBump';

export type RoundImageProps = {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    variant?: 'border' | 'standard';
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    className?: string;
    /** Lift on hover. Leave off in tables and lists, and when a wrapper carries hoverBumpSx. */
    bump?: boolean;
};

const smallStyle = {
    height: '24px',
    width: '24px',
    border: '1px solid',
};

const mediumStyle = {
    height: '35px',
    width: '35px',
    border: '2px solid',
};

const largeStyle = {
    height: '80px',
    width: '80px',
    border: '4px solid',
};

const xlargeStyle = {
    height: '125px',
    width: '125px',
    border: '4px solid',
};

const sizeStyles = {
    small: smallStyle,
    medium: mediumStyle,
    large: largeStyle,
    xlarge: xlargeStyle,
};

/**
 * Round avatar/logo. Falls back to the alt's initial when `src` is empty or fails to load,
 * which matters because Resource rows ship with an empty src until someone uploads one.
 */
export const RoundImage = ({
    src,
    alt,
    style,
    className = '',
    variant = 'standard',
    size = 'small',
    bump = false,
}: RoundImageProps) => {
    const theme = useTheme();

    const sizeStyle = sizeStyles[size];
    // Keep the fallback initial in proportion however the size was set.
    const heightPx = parseInt(String(style?.height ?? sizeStyle.height), 10);

    return (
        <Avatar
            // An empty string resolves against the page URL and renders a broken image.
            src={src || undefined}
            alt={alt}
            className={className}
            sx={{
                ...sizeStyle,
                ...(variant === 'border' ? {} : { border: 'none' }),
                borderColor: theme.palette.primary.main,
                fontSize: Number.isFinite(heightPx) ? `${Math.round(heightPx * 0.4)}px` : undefined,
                ...(bump && {
                    transition: BUMP_TRANSITION,
                    '&:hover': { transform: BUMP_TRANSFORM, boxShadow: BUMP_SHADOW },
                    '.lottie-icon-container:hover &': { transform: BUMP_TRANSFORM, boxShadow: BUMP_SHADOW },
                    '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                        '&:hover': { transform: 'none', boxShadow: 'none' },
                        '.lottie-icon-container:hover &': { transform: 'none', boxShadow: 'none' },
                    },
                }),
                ...style,
            }}
        />
    );
};
