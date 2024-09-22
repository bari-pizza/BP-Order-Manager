import { useTheme } from '@mui/material';

export type RoundImageProps = {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    variant?: 'border' | 'standard';
    size?: 'small' | 'medium' | 'large' | 'xlarge';
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

export const RoundImage = ({ src, alt, style, variant = 'standard', size = 'small' }: RoundImageProps) => {
    const theme = useTheme();

    const finalStyle = {
        borderRadius: '50%',
        ...(size === 'small' ? smallStyle : {}),
        ...(size === 'medium' ? mediumStyle : {}),
        ...(size === 'large' ? largeStyle : {}),
        ...(size === 'xlarge' ? xlargeStyle : {}),
        ...(variant === 'border' ? {} : { border: 'none' }),
        borderColor: theme.palette.primary.main,
        ...style,
    };

    return <img src={src} alt={alt} style={finalStyle} />;
};
