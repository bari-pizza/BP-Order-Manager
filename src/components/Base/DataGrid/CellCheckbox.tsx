import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, Box } from '@mui/material';
import { GridRenderCellParams, GridRenderEditCellParams } from '@mui/x-data-grid';

export const CellCheckbox = ({
    params,
    onChange,
}: {
    params: GridRenderCellParams;
    onChange?: () => void;
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                height: '100%',
                '& .MuiCheckbox-root': {
                    width: '100%',
                },
            }}>
            <Checkbox
                checked={!!params.value}
                onChange={onChange}
                onClick={(event) => event.stopPropagation()}
            />
        </Box>
    );
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
                padding: 0,
                height: '100%',
                width: '100%',
                '& .MuiSvgIcon-root': {
                    color: isDirty ? theme.palette.secondary.main : '',
                },
                '& .MuiCheckbox-root': {
                    width: '100%',
                },
            }}>
            <Checkbox checked={!!params.value} onChange={handleCheckboxChange} />
        </Box>
    );
};
