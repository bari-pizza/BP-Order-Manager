import { Box } from '@mui/material';
import { RoundImage } from '../RoundImage';

export const CellImage = ({ src }: { src: string }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                height: '100%',
            }}>
            <RoundImage src={src} alt={src} size="medium" />
        </Box>
    );
};
