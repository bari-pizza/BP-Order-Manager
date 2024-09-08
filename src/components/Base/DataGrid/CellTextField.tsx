import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid';

export const CellEditTextField = <T,>({ field, params }: { field: keyof T; params: GridRenderEditCellParams }) => {
    const [originalValue] = useState(params.value);
    const theme = useTheme();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        params.api.setEditCellValue({ id: params.id, field: field as string, value: event.target.value });
    };

    const isDirty = originalValue !== params.value;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
            <TextField
                value={params.value || ''}
                onChange={handleChange}
                sx={{ input: { color: isDirty ? theme.palette.secondary.main : '' } }}
            />
        </Box>
    );
};
