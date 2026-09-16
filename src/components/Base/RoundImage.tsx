import { Box, useTheme } from '@mui/material';

export type RoundImageProps = {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    variant?: 'border' | 'standard';
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    className?: string;
    /** Lift slightly on hover. Off in tables and lists, where movement is just noise. */
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

const bumpHover = {
    transform: 'translateY(-2px) scale(1.06)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
};

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

    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            className={className}
            sx={{
                borderRadius: '50%',
                objectFit: 'cover',
                ...(size === 'small' ? smallStyle : {}),
                ...(size === 'medium' ? mediumStyle : {}),
                ...(size === 'large' ? largeStyle : {}),
                ...(size === 'xlarge' ? xlargeStyle : {}),
                ...(variant === 'border' ? {} : { border: 'none' }),
                borderColor: theme.palette.primary.main,
                ...(bump && {
                    transition: 'transform 180ms ease-out, box-shadow 180ms ease-out',
                    transform: 'translateY(0) scale(1)',
                    // Hovering the avatar itself, or any card/row that opts in by carrying the
                    // .lottie-icon-container class, plays the bump.
                    '&:hover': bumpHover,
                    '.lottie-icon-container:hover &': bumpHover,
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
