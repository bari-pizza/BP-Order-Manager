import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, Box } from '@mui/material';
import { GridRenderCellParams, GridRenderEditCellParams } from '@mui/x-data-grid';

export const CellCheckbox = ({ params }: { params: GridRenderCellParams }) => {
    return <Checkbox checked={!!params.value} />;
};

export const CellEditCheckbox = <T,>({ field, params }: { field: keyof T; params: GridRenderEditCellParams }) => {
    const [originalValue] = useState(params.value);
    const theme = useTheme();

    const handleCheckboxChange = () => {
        params.api.setEditCellValue({ id: params.id, field: field as string, value: !params.value });
    };

    const isDirty = originalValue !== params.value;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                '& .MuiSvgIcon-root': {
                    color: isDirty ? theme.palette.secondary.main : '',
                },
            }}>
            <Checkbox checked={!!params.value} onChange={handleCheckboxChange} />
        </Box>
    );
};
