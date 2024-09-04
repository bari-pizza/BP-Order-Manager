import { Box, Tooltip } from '@mui/material';
import styles from './ToDo.module.css';

export const TODO = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="TODO">
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
