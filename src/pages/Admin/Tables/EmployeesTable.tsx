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
import { Employee } from '../../../typesAndValidators';
import { updateEmployee } from '../../../supabaseQueries';
import { useMutation } from '@tanstack/react-query';
import { CellEditCheckbox, CellCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../../components/Base/DataGrid/createCellActions';
import { Email as EmailIcon } from '@mui/icons-material';
import { Id, toast } from 'react-toastify';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { useRef, useState } from 'react';
import { supaClient } from '../../../supaClient';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { m } from '../../../paraglide/messages';

export const EmployeesTable = ({ employees }: { employees: Employee[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<Employee>({ data: employees });
    const toastRef = useRef<Id>('');

    const deleteEmployee = async (employee: Employee) => {
        // TODO: create a similar function and confirmation for each table with createCellActions
        // TODO: show deleted employees as greyed out or something
        // TODO: show deleted employees at the bottom
        const { id, first_name, last_name } = employee;
        const fullName = `${first_name} ${last_name}`;
        toastRef.current = toast.loading(`${m.deleting()} ${m.employee()} ${fullName}`);
        const { error } = await supaClient.rpc('update_employee', { p_id: id, p_is_deleted: true });
        if (error) {
            toast.update(toastRef.current, {
                render: error.message,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            return;
        } else {
            toast.update(toastRef.current, {
                render: m.targetDeletedSuccessfully({ targetName: m.employee(), fullName }),
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            // take row out of edit mode
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View },
            });
        }
    };

    const restoreEmployee = async (employee: Employee) => {
        const { id } = employee;
        const fullName = `${employee.first_name} ${employee.last_name}`;
        toastRef.current = toast.loading(m.restoring({ target: m.employee(), fullName }));
        const { error } = await supaClient.rpc('update_employee', { p_id: id, p_is_deleted: false });
        if (error) {
            toast.update(toastRef.current, {
                render: error.message,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            return;
        } else {
            toast.update(toastRef.current, {
                render: m.restoredSuccessfully({ target: m.employee(), fullName }),
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    const { handleConfirmation: confirmDelete } = useConfirmationToast<Employee>({
        // message: 'Are you sure you want to delete this employee?',
        message: (employee) => {
            const { first_name, last_name } = employee;
            const fullName = `${first_name} ${last_name}`;
            return m.areYouSureYouWant({ message: `${m.toDelete()} ${fullName}` });
        },
        confirmProps: {
            color: 'error',
            variant: 'outlined',
            handler: (employee) => {
                const { id } = employee;
                if (!id) {
                    toast.error(m.operationFailed());
                    return;
                }
                deleteEmployee(employee);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Delete',
        },
    });

    const { handleConfirmation: confirmRestore } = useConfirmationToast<Employee>({
        message: (employee) => {
            const { first_name, last_name } = employee;
            const fullName = `${first_name} ${last_name}`;
            return m.areYouSureYouWant({ message: m.toRestore({ targetName: fullName }) });
        },
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (employee) => {
                const { id } = employee;
                if (!id) {
                    toast.error(m.operationFailed());
                    return;
                }
                restoreEmployee(employee);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Restore',
        },
    });

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

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
        },
        onError: (error) => {
            console.log({ error });
        },
    });

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as Employee),
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
            headerName: m.actions(),
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const { is_deleted } = row;
                if (is_deleted) {
                    return createCellActions(
                        id,
                        rowModesModel,
                        setRowModesModel,
                        () => confirmRestore(row),
                        is_deleted,
                    );
                }
                return createCellActions(id, rowModesModel, setRowModesModel, () => confirmDelete(row), is_deleted);
            },
        },
        {
            field: 'first_name',
            headerName: m.firstName(),
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="first_name" />;
            },
        },
        {
            field: 'last_name',
            headerName: m.lastName(),
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="last_name" />;
            },
        },
        {
            field: 'email',
            headerName: m.email(),
            width: 200,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} inputProps={{ disabled: true }} field="email" />;
            },
        },
        {
            field: 'phone',
            headerName: m.phone(),
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="phone" />;
            },
        },
        {
            field: 'is_admin',
            headerName: m.admin(),
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
            headerName: m.manager(),
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
            headerName: m.driver(),
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
            headerName: m.sendEmail(),
            headerAlign: 'center',
            width: 175,
            editable: false,
            renderCell: ({ row: { email, is_deleted } }) => <RenderEmail email={email} disabled={is_deleted} />,
        },
    ];
    return (
        <Stack direction="column" minHeight="300px">
            <DataGrid
                sx={{
                    '& .row-is-edit': { border: '2px solid', borderColor: 'primary.main' },
                    '& .row-is-deleted': {
                        color: 'text.disabled',
                        '& .MuiButtonBase-root': { color: 'text.disabled' },
                        '& .actions .MuiButtonBase-root': { color: 'primary.main' },
                    },
                    '.MuiDataGrid-columnHeader': { textTransform: 'capitalize' },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableVirtualization
                onCellDoubleClick={(_params, event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                disableRowSelectionOnClick
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={(params) => {
                    const isDeleted = params.row.is_deleted;
                    if (isDeleted) return 'row-is-deleted';
                    const isEditing = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                    return isEditing ? 'row-is-edit' : '';
                }}
            />
        </Stack>
    );
};

const RenderEmail = ({ email, disabled }: { email: string; disabled: boolean }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toastRef = useRef<Id>('');

    const handlePasswordReset = async () => {
        setIsSubmitting(true);
        toastRef.current = toast.loading(m.sendingPWResetEmailToTarget({ targetName: email }));
        await supaClient.auth.resetPasswordForEmail(email, { redirectTo: '/myaccount' }).then(({ error }) => {
            if (error) {
                toast.update(toastRef.current, {
                    render: error.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            } else {
                toast.update(toastRef.current, {
                    render: m.sentPWResetEmail(),
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
            setIsSubmitting(false);
        });
    };

    const { handleConfirmation } = useConfirmationToast({
        message: m.areYouSureYouWant({ message: m.toSendPWResetEmailTo({ email }) }),
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
        <Tooltip sx={{ textTransform: 'capitalize' }} title={m.sendPWResetEmail()}>
            <IconButton
                onClick={handleConfirmation}
                disabled={isSubmitting || disabled}
                color="primary"
                sx={{ justifyContent: 'center', width: '100%' }}>
                <EmailIcon />
            </IconButton>
        </Tooltip>
    );
};
