import { Box, Tooltip } from '@mui/material';
import styles from './Todo.module.css';

export const Todo = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="Todo">
                <Box
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
