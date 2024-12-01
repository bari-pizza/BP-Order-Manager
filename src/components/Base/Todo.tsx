import { Box, Tooltip } from '@mui/material';
import styles from './Todo.module.css';
import { toast } from 'react-toastify';

export const Todo = ({ message, children }: { message?: string; children: React.ReactNode }) => {
    if (import.meta.env.MODE !== 'development' || process.env.NODE_ENV !== 'development') {
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
