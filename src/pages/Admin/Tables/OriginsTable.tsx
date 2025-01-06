import { Stack, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { OrderOrigin } from '../../../typesAndValidators';
import { CellCheckbox, CellEditCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../../components/Base/DataGrid/createCellActions';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { LogoUploader } from '../LogoUploader';
import { useOrderOriginCRUD } from '../../../api/orderOrigin';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { Id, toast } from 'react-toastify';
import { supaClient } from '../../../supaClient';
import { useRef } from 'react';
import { ExampleOrderTypeSelector, ExamplePaymentSelector } from '../../Orders/OrderEditor/PaymentEditor';

const ExampleOrigin = ({ origin }: { origin: OrderOrigin }) => {
    let cash = true,
        card = true,
        thirdParty = false,
        selected: 'cash' | 'card' | 'third_party' = 'cash';
    if (origin.default_is_prepaid) {
        thirdParty = true;
        selected = 'third_party';
        if (!origin.is_prepaid_toggleable) {
            cash = false;
            card = false;
        }
    } else if (origin.is_prepaid_toggleable) {
        thirdParty = true;
    }

    // TODO: Don't allow tipping when origin.can_tip is false
    // if too complicated, just remove .can_tip all together

    return (
        <Stack direction="column" spacing={1} width={400} textAlign="center">
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <LogoUploader origin={origin} disabled />
                <Typography variant="h6">{origin.name}</Typography>
            </Stack>
            <Typography variant="h6">Order {origin.has_order_number ? 'Number' : 'Name'}</Typography>
            <ExampleOrderTypeSelector delivery={origin.can_deliver} />
            <ExamplePaymentSelector cash={cash} card={card} thirdParty={thirdParty} selected={selected} />
            <Typography variant="h6">{origin.can_tip ? 'Accepts' : 'Does not accept'} tips</Typography>
        </Stack>
    );
};

export const OriginsTable = ({ origins }: { origins: OrderOrigin[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<OrderOrigin>({ data: origins });
    const { orderOriginMutations } = useOrderOriginCRUD({ queryKey: ['origins'] });
    const toastRef = useRef<Id>('');

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = {
            ...(newRow as OrderOrigin),
        };
        // TODO: alert('this should open a dialog with a preview of the changes, allowing admin to accept or reject');
        toastRef.current = toast.loading(`Updating origin ${updatedRow.name}`);
        toast.update(toastRef.current, {
            render: <ExampleOrigin origin={updatedRow} />,
            type: 'info',
            isLoading: false,
            autoClose: false,
            closeButton: true,
        });
        orderOriginMutations.update(updatedRow as OrderOrigin);
        setRows((prev) => prev.map((row) => (row.origin_id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const deleteOrigin = async (id: string) => {
        toastRef.current = toast.loading(`Deleting origin ${id}`);
        const { error } = await supaClient.from('OrderOrigin').update({ is_deleted: true }).eq('origin_id', id);
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
                render: 'Origin deleted successfully',
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

    const restoreOrigin = async (id: string) => {
        toastRef.current = toast.loading(`Restoring origin ${id}`);
        const { error } = await supaClient.from('OrderOrigin').update({ is_deleted: false }).eq('origin_id', id);
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
                render: 'Origin restored successfully',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    const { handleConfirmation: confirmDelete } = useConfirmationToast({
        message: 'Are you sure you want to delete this origin?',
        confirmProps: {
            color: 'error',
            variant: 'outlined',
            handler: (...args: unknown[]) => {
                const id = args[0] as string;
                if (!id) {
                    toast.error('Operation failed - try again!');
                    return;
                }
                toast.info(`deleting origin`);
                deleteOrigin(id);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Delete',
        },
    });

    const { handleConfirmation: confirmRestore } = useConfirmationToast({
        message: 'Are you sure you want to restore this origin?',
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (...args: unknown[]) => {
                const id = args[0] as string;
                if (!id) {
                    toast.error('Operation failed - try again!');
                    return;
                }
                toast.info(`restoring origin`);
                restoreOrigin(id);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Restore',
        },
    });

    const columns: GridColDef<OrderOrigin>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edit',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ row: { is_deleted, origin_id } }) => {
                if (is_deleted) {
                    return createCellActions(
                        origin_id,
                        rowModesModel,
                        setRowModesModel,
                        () => confirmRestore(origin_id),
                        is_deleted,
                    );
                }
                return createCellActions(
                    origin_id,
                    rowModesModel,
                    setRowModesModel,
                    () => confirmDelete(origin_id),
                    is_deleted,
                );
            },
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true,
            renderEditCell: (params) => {
                return <CellEditTextField params={params} field="name" />;
            },
        },
        {
            field: 'icon',
            headerName: 'Icon',
            width: 100,
            editable: true,
            renderCell: (params) => {
                return <LogoUploader origin={params.row} disabled />;
            },
            renderEditCell: (params) => {
                const onSuccess = (downloadURL: string) => {
                    console.log(`saving ${downloadURL}`);
                    params.api.setEditCellValue({ id: params.id, field: 'icon', value: downloadURL });
                };
                return <LogoUploader origin={params.row} onSuccess={onSuccess} />;
            },
        },
        {
            field: 'can_deliver',
            headerName: 'Can Deliver',
            width: 150,
            editable: true,

            headerAlign: 'center',
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="can_deliver" />;
            },
        },
        {
            field: 'can_tip',
            headerName: 'Can Tip',
            width: 150,
            editable: true,
            headerAlign: 'center',
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="can_tip" />;
            },
        },
        {
            field: 'has_order_number',
            headerName: 'Has Order Number',
            width: 150,
            editable: true,
            headerAlign: 'center',
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="has_order_number" />;
            },
        },
        {
            field: 'default_is_prepaid',
            headerName: 'Default Is Prepaid',
            width: 150,
            editable: true,
            headerAlign: 'center',
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="default_is_prepaid" />;
            },
        },
        {
            field: 'is_prepaid_toggleable',
            headerName: 'Is Prepaid Toggleable',
            width: 150,
            editable: true,
            headerAlign: 'center',
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="is_prepaid_toggleable" />;
            },
        },
    ];
    return (
        <Stack direction="column">
            <DataGrid
                sx={{
                    '& .row-is-edit': { border: '2px solid', borderColor: 'primary.main' },
                    '& .row-is-deleted': {
                        color: 'text.disabled',
                        '& .MuiButtonBase-root': { color: 'text.disabled' },
                        '& .actions .MuiButtonBase-root': { color: 'primary.main' },
                    },
                    '& .MuiDataGrid-cell--editing': { padding: 0 },
                }}
                disableVirtualization
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowId={(row) => row.origin_id}
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
