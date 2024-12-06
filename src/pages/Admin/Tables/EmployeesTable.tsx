import { IconButton, Stack, Tooltip } from '@mui/material';
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
import { updateEmployee } from '../../../supabaseQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CellEditCheckbox, CellCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../../components/Base/DataGrid/createCellActions';
import { Email as EmailIcon } from '@mui/icons-material';
import { Id, toast } from 'react-toastify';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { useRef, useState } from 'react';
import { supaClient } from '../../../supaClient';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';

type Employee = Profile & { is_driver: boolean };

export const EmployeesTable = ({ employees }: { employees: Employee[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<Employee>({ data: employees });

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const queryClient = useQueryClient();

    const updateEmployeeMutation = useMutation({
        mutationFn: (employee: Employee) => {
            const { is_driver, ...profile } = employee;
            console.log({ profile, is_driver });
            return updateEmployee(profile, is_driver);
        },
        onSuccess: (data) => {
            console.log({ data });
            const { profile, driver } = data[0];
            const updatedRow = {
                ...profile,
                is_driver: driver && !driver.is_deleted,
            };
            console.log({ updatedRow });
            setRows((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
            queryClient.invalidateQueries({ queryKey: ['drivers'] }); // could change if driver is deleted
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
        setRows((prev) => prev.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<Employee>[] = [
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
            headerAlign: 'center',
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
            headerAlign: 'center',
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
            headerAlign: 'center',
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
            headerAlign: 'center',
            width: 175,
            editable: false,
            renderCell: ({ row: { email } }) => <RenderEmail email={email} />,
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                sx={{
                    '& .row-is-edit': { border: '2px solid', borderColor: 'primary.main' },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableVirtualization
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

const RenderEmail = ({ email }: { email: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toastRef = useRef<Id>('');

    const handlePasswordReset = async () => {
        setIsSubmitting(true);
        toastRef.current = toast.loading(`Sending password reset email to ${email}`);
        await supaClient.auth.resetPasswordForEmail(email).then(({ error }) => {
            if (error) {
                toast.update(toastRef.current, {
                    render: error.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            } else {
                toast.update(toastRef.current, {
                    render: `Password reset email sent to ${email}`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
            setIsSubmitting(false);
        });
    };

    const { handleConfirmation } = useConfirmationToast({
        message: `Are you sure you want to send a password reset email to ${email}?`,
        confirmProps: {
            handler: handlePasswordReset,
            buttonText: 'Send',
            color: 'primary',
        },
        cancelProps: {
            buttonText: 'Cancel',
            color: 'error',
        },
    });

    return (
        <Tooltip title="Send password reset email">
            <IconButton
                onClick={handleConfirmation}
                disabled={isSubmitting}
                color="primary"
                sx={{ justifyContent: 'center', width: '100%' }}>
                <EmailIcon />
            </IconButton>
        </Tooltip>
    );
};
