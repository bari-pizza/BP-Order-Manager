import { GridActionsCellItem, GridRowId, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';

import { Cancel as CancelIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

export const createCellActions = (
    id: GridRowId,
    rowModesModel: GridRowModesModel,
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>,
) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    if (isInEditMode) {
        return [
            <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                    color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
            />,
        ];
    }

    return [
        <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
        />,
    ];
};
