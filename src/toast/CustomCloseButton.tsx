import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export const CustomCloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <IconButton
            onClick={onClose}
            size="small"
            sx={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                color: 'rgba(0, 0, 0, 0.5)', // Matches Toastify's default
            }}>
            {/* TODO: dont make this absolute so it fits correctly */}
            <CloseIcon fontSize="small" />
        </IconButton>
    );
};
