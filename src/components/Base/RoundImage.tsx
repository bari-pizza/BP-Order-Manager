import { Avatar, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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
                // Callers size this in `em` (DrawerCardBase uses 4em). Avatar would otherwise
                // resolve that against its own 1.25rem default instead of the inherited size.
                fontSize: 'inherit',
                // Match the bare <img> this replaced; the grey only belongs behind the fallback.
                ...(src ? { bgcolor: 'transparent' } : {}),
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
            }}>
            {/* Only rendered when src is empty or the image fails; sized by percentage so it
                tracks the avatar whatever units the caller used. */}
            <PersonIcon sx={{ width: '75%', height: '75%' }} />
        </Avatar>
    );
};
