import { IconButton, Stack } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { Profile } from '../../../typesAndValidators';
import { useState } from 'react';
import { updateEmployee } from '../../../supabaseQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CellEditCheckbox, CellCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../../components/Base/DataGrid/createCellActions';
import { Email as EmailIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

type Employee = Profile & { is_driver: boolean };

export const EmployeesTable = ({ employees }: { employees: Employee[] }) => {
    const [rows, setRows] = useState<Employee[]>(employees);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const queryClient = useQueryClient();

    const updateEmployeeMutation = useMutation({
        mutationFn: (employee: Employee) => {
            const { is_driver, ...profile } = employee;
            return updateEmployee(profile, is_driver);
        },
        onSuccess: (data) => {
            const { profile, driver } = data[0];
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
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return createCellActions(id, rowModesModel, setRowModesModel);
            },
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="first_name" />;
            },
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="last_name" />;
            },
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
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="phone" />;
            },
        },
        {
            field: 'is_admin',
            headerName: 'Admin',
            width: 100,
            editable: true,
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="is_admin" />;
            },
        },
        {
            field: 'is_manager',
            headerName: 'Manager',
            width: 100,
            editable: true,

            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="is_manager" />;
            },
        },
        {
            field: 'is_driver',
            headerName: 'Driver',
            width: 100,
            editable: true,
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="is_driver" />;
            },
        },
        {
            field: 'send_email',
            headerName: 'Send PW Reset Email',
            width: 175,
            editable: false,
            renderCell: (params) => {
                const handleClick = () => {
                    toast.info('This feature is not yet implemented');
                    toast.success(`Sent password reset email to ${params.row.email}`);
                };
                return (
                    <IconButton onClick={handleClick}>
                        <EmailIcon />
                    </IconButton>
                );
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
