import { Stack, Checkbox } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { Profile } from '../../typesAndValidators';
import { useState } from 'react';
import { Save as SaveIcon, Delete as DeleteIcon, Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { updateEmployee } from '../../supabaseQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Employee = Profile & { is_driver: boolean };

export const EmployeesTable = ({ employees }: { employees: Employee[] }) => {
    const [rows, setRows] = useState<Employee[]>(employees);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        alert(`This action not yet implemented ${id}`);
        // setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const queryClient = useQueryClient();

    const updateEmployeeMutation = useMutation({
        mutationFn: (employee: Employee) => {
            const { is_driver, ...profile } = employee;
            return updateEmployee(profile, is_driver);
        },
        onSuccess: (data) => {
            const { profile, driver } = data;
            const updatedRow = {
                ...profile,
                is_driver: !driver?.is_deleted,
            };
            setRows((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
        onError: (error) => {
            console.log({ error });
        },
    });

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as Employee),
            // isNew: false
        };
        updateEmployeeMutation.mutate(updatedRow);
        // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setRows((prev) => prev.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 150,
            editable: true,
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 150,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
            editable: true,
        },
        {
            field: 'is_admin',
            headerName: 'Admin',
            width: 125,
            editable: true,
            renderCell: (params) => {
                return <Checkbox checked={!!params.value} />;
            },
            renderEditCell: (params) => {
                const handleClick = () => {
                    params.api.setEditCellValue({ id: params.id, field: 'is_admin', value: !params.value });
                };
                return <Checkbox checked={!!params.value} onClick={handleClick} />;
            },
        },
        {
            field: 'is_manager',
            headerName: 'Manager',
            width: 125,
            editable: true,

            renderCell: (params) => {
                return <Checkbox checked={!!params.value} />;
            },
            renderEditCell: (params) => {
                const handleClick = () => {
                    params.api.setEditCellValue({ id: params.id, field: 'is_manager', value: !params.value });
                };
                return <Checkbox checked={!!params.value} onClick={handleClick} />;
            },
        },
        {
            field: 'is_driver',
            headerName: 'Driver',
            width: 125,
            editable: true,
            renderCell: (params) => {
                return <Checkbox checked={!!params.value} />;
            },
            renderEditCell: (params) => {
                const handleClick = () => {
                    params.api.setEditCellValue({ id: params.id, field: 'is_driver', value: !params.value });
                };
                return <Checkbox checked={!!params.value} onClick={handleClick} />;
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

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
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                sx={{
                    '& .row-is-edit': { border: '2px solid', borderColor: 'primary.main' },
                }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={(params) => {
                    const isEditing = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                    return isEditing ? 'row-is-edit' : '';
                }}
            />
        </Stack>
    );
};
