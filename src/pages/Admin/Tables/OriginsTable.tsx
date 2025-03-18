import { Stack, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
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
// @ts-expect-error remove if module declaration can be fixed
import { m } from '../../../paraglide/messages';

const ExampleOrigin = ({ origin }: { origin: OrderOrigin }) => {
    if (!origin) return null;
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

    return (
        <Stack direction="column" spacing={1} width={400} textAlign="center">
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <LogoUploader origin={origin} disabled />
                <Typography variant="h6">{origin.name}</Typography>
            </Stack>
            <Typography variant="h6" textTransform={'capitalize'}>
                {origin.has_order_number ? m.order_number() : m.order_name()}
            </Typography>
            <ExampleOrderTypeSelector delivery={origin.can_deliver} />
            <ExamplePaymentSelector cash={cash} card={card} thirdParty={thirdParty} selected={selected} />
            <Typography variant="h6">{origin.can_tip ? 'Accepts' : 'Does not accept'} tips</Typography>
        </Stack>
    );
};

// TODO: useConfirmationToast to confirm changes (add body to toast, allow for centering)

type OriginRow = OrderOrigin & { is_pending?: boolean };

export const OriginsTable = ({ origins }: { origins: OrderOrigin[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<OriginRow>({ data: origins });
    const { orderOriginMutations } = useOrderOriginCRUD({ queryKey: ['origins'] });
    const toastRef = useRef<Id>('');

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const { handleConfirmation: confirmEdit } = useConfirmationToast<OriginRow>({
        message: 'Origin Preview',
        messageProps: { variant: 'h3' },
        position: 'center',
        renderBody: (origin) => {
            return <ExampleOrigin origin={origin} />;
        },
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (originRow) => {
                const newRow = originRow;
                const id = newRow.origin_id;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { is_pending, ...origin } = newRow;
                if (!id) {
                    toast.error('Operation failed - try again!');
                    return;
                }
                orderOriginMutations.update(origin);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Save Changes',
        },
        cancelProps: {
            handler: (originRow) => {
                const oldRow = originRow!;
                const id = oldRow.origin_id;
                oldRow.is_pending = false;
                setRows((prev) => prev.map((row) => (row.origin_id === id ? oldRow : row)));
            },
        },
    });

    const processRowUpdate = (newRow: OriginRow, oldRow: OriginRow) => {
        if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
            toast.info('No changes to save');
            return {
                ...newRow,
                is_pending: false,
            };
        }
        confirmEdit(newRow, oldRow);
        return {
            ...newRow,
            is_pending: true,
        };
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const deleteOrigin = async (origin: OrderOrigin) => {
        const { origin_id: id, name } = origin;
        toastRef.current = toast.loading(`Deleting origin: ${name}`);
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
                render: `Origin ${name} deleted successfully`,
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

    const restoreOrigin = async (origin: OrderOrigin) => {
        const { origin_id: id, name } = origin;
        toastRef.current = toast.loading(`Restoring origin ${name}`);
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
                render: `Origin ${name} restored successfully`,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    const { handleConfirmation: confirmDelete } = useConfirmationToast<OriginRow>({
        message: (origin) => `Are you sure you want to delete ${origin.name}?`,
        confirmProps: {
            color: 'error',
            variant: 'outlined',
            handler: (origin) => {
                const { origin_id: id } = origin;
                if (!id) {
                    toast.error('Operation failed - try again!');
                    return;
                }
                deleteOrigin(origin);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Delete',
        },
    });

    const { handleConfirmation: confirmRestore } = useConfirmationToast<OriginRow>({
        message: (origin) => {
            const { name } = origin;
            return `Are you sure you want to restore ${name}?`;
        },
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (origin) => {
                const id = origin.origin_id;
                if (!id) {
                    toast.error('Operation failed - try again!');
                    return;
                }
                restoreOrigin(origin);
                setRowModesModel({
                    ...rowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            },
            buttonText: 'Restore',
        },
    });

    const columns: GridColDef<OriginRow>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edit',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ row }) => {
                const { origin_id, is_deleted } = row;
                if (is_deleted) {
                    return createCellActions(
                        origin_id,
                        rowModesModel,
                        setRowModesModel,
                        () => confirmRestore(row),
                        is_deleted,
                    );
                }
                return createCellActions(
                    origin_id,
                    rowModesModel,
                    setRowModesModel,
                    () => confirmDelete(row),
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
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={2} justifyContent="center">
                        <LogoUploader origin={params.row} disabled />
                    </Stack>
                );
            },
            renderEditCell: (params) => {
                const onSuccess = (downloadURL: string) => {
                    console.log(`saving ${downloadURL}`);
                    params.api.setEditCellValue({ id: params.id, field: 'icon', value: downloadURL });
                };
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={2} justifyContent="center">
                        <LogoUploader origin={params.row} onSuccess={onSuccess} />
                    </Stack>
                );
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
                    '& .row-is-pending': {
                        color: 'text.disabled',
                        '& .MuiButtonBase-root': { color: 'text.disabled' },
                        '& .actions .MuiButtonBase-root': { color: 'primary.main' },
                    },
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
                    const isPending = params.row.is_pending;
                    if (isPending) return 'row-is-pending';
                    if (isDeleted) return 'row-is-deleted';
                    const isEditing = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                    return isEditing ? 'row-is-edit' : '';
                }}
            />
        </Stack>
    );
};
