import { Box, Tooltip } from '@mui/material';
import styles from './Todo.module.css';
import { toast } from '../../toast/toastWrapper';
import { getEnv } from '../../utils';

export const Todo = ({ message, children }: { message?: string; children: React.ReactNode }) => {
    // if (import.meta.env.MODE !== 'development' || process.env.NODE_ENV !== 'development') {
    if (getEnv('MODE') === 'production') {
        return null;
    }
    const handleClick = () => {
        if (message) {
            toast.info(message);
        }
    };
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="Todo">
                <Box
                    onClick={handleClick}
                    className={styles['crawl-border']}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'max-content',
                        padding: '5px',
                        margin: '20px',
                    }}>
                    {children}
                </Box>
            </Tooltip>
        </Box>
    );
};
