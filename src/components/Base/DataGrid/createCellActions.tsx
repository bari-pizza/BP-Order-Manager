import { GridActionsCellItem, GridRowId, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';

import { Replay as ReplayIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

export const createCellActions = (
    id: GridRowId,
    rowModesModel: GridRowModesModel,
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>,
    handleDeleteToggleClick: (id: GridRowId) => void,
    isDeleted: boolean,
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

    const handleToggleClick = (id: GridRowId) => () => {
        handleDeleteToggleClick(id);
    };

    if (isDeleted) {
        return [
            <GridActionsCellItem
                icon={<ReplayIcon />}
                label="Restore"
                className="textPrimary"
                color="inherit"
                onClick={handleToggleClick(id)}
            />,
        ];
    }

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
                icon={<ReplayIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                className="textPrimary"
                color="error"
                onClick={handleToggleClick(id)}
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
