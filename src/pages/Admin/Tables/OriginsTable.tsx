import { Alert, Button, Collapse, Stack, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridRowSelectionModel,
} from '@mui/x-data-grid';
import { OrderOrigin } from '../../../typesAndValidators';
import { CellCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { LogoUploader } from '../LogoUploader';
import { useConfirmationToast } from '../../../toast/useConfirmationToast';
import { Id, toast } from '../../../toast/toastWrapper';
import { supaClient } from '../../../supaClient';
import { useRef, useState } from 'react';
import { ExampleOrderTypeSelector, ExamplePaymentSelector } from '../../Orders/OrderEditor/PaymentEditor';
import { m } from '../../../types/messages';
import { SaveOutlined, UndoOutlined, DeleteOutline, RestoreOutlined } from '@mui/icons-material';

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
                {origin.has_order_number ? m.orderNumber() : m.orderName()}
            </Typography>
            <ExampleOrderTypeSelector delivery={origin.can_deliver} />
            <ExamplePaymentSelector cash={cash} card={card} thirdParty={thirdParty} selected={selected} />
            <Typography variant="h6">{origin.can_tip ? 'Accepts' : 'Does not accept'} tips</Typography>
        </Stack>
    );
};

type OriginRow = OrderOrigin;

export const OriginsTable = ({ origins }: { origins: OrderOrigin[] }) => {
    const [rows, setRows] = useState<OriginRow[]>(origins);
    const [dirtyRowIds, setDirtyRowIds] = useState<Set<GridRowId>>(new Set());
    const [originalRows, setOriginalRows] = useState<Map<GridRowId, OriginRow>>(new Map());
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const toastRef = useRef<Id>('');

    const getDirtyRows = () => {
        return rows.filter((row) => dirtyRowIds.has(row.origin_id));
    };

    const rowsMatch = (a: OriginRow, b: OriginRow) => JSON.stringify(a) === JSON.stringify(b);

    const handleCellEdit = (newRow: OriginRow) => {
        const currentRow = rows.find((row) => row.origin_id === newRow.origin_id);
        if (!currentRow || rowsMatch(currentRow, newRow)) {
            return newRow;
        }

        const originalRow = originalRows.get(newRow.origin_id) ?? currentRow;
        const isBackToOriginal = rowsMatch(originalRow, newRow);

        setRows((prev) => prev.map((row) => (row.origin_id === newRow.origin_id ? newRow : row)));

        if (isBackToOriginal) {
            setDirtyRowIds((prev) => {
                const next = new Set(prev);
                next.delete(newRow.origin_id);
                return next;
            });
            setOriginalRows((prev) => {
                const next = new Map(prev);
                next.delete(newRow.origin_id);
                return next;
            });
        } else {
            setOriginalRows((prev) => {
                if (prev.has(newRow.origin_id)) {
                    return prev;
                }
                return new Map(prev.set(newRow.origin_id, currentRow));
            });
            setDirtyRowIds((prev) => new Set(prev.add(newRow.origin_id)));
        }

        return newRow;
    };

    const toggleBoolean = (row: OriginRow, field: keyof OriginRow) => {
        handleCellEdit({ ...row, [field]: !row[field] });
    };

    const handleSaveAll = () => {
        const dirtyRows = getDirtyRows();
        
        if (dirtyRows.length === 0) {
            toast.info(m.noChangesDetected());
            return;
        }

        // Show preview of first changed origin
        confirmSave(dirtyRows);
    };

    const handleCancelAll = () => {
        // Revert all dirty rows to original
        setRows((prev) =>
            prev.map((row) => {
                const original = originalRows.get(row.origin_id);
                return original || row;
            })
        );
        setDirtyRowIds(new Set());
        setOriginalRows(new Map());
        toast.info('All changes cancelled');
    };

    const handleDelete = async () => {
        const selected = rows.filter((row) => selectionModel.includes(row.origin_id));
        
        if (selected.length === 0) {
            toast.error('No origins selected');
            return;
        }

        confirmDelete(selected);
    };

    const handleRestore = async () => {
        const selected = rows.filter((row) => selectionModel.includes(row.origin_id) && row.is_deleted);
        
        if (selected.length === 0) {
            toast.error('No deleted origins selected');
            return;
        }

        confirmRestore(selected);
    };

    const deleteOrigins = async (origins: OrderOrigin[]) => {
        toastRef.current = toast.loading(`Deleting ${origins.length} origin(s)...`);
        
        const promises = origins.map((origin) =>
            supaClient.from('OrderOrigin').update({ is_deleted: true }).eq('origin_id', origin.origin_id)
        );

        const results = await Promise.all(promises);
        const errors = results.filter((r) => r.error);

        if (errors.length > 0) {
            toast.update(toastRef.current, {
                render: `Failed to delete ${errors.length} origin(s)`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
        } else {
            toast.update(toastRef.current, {
                render: `Successfully deleted ${origins.length} origin(s)`,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            setSelectionModel([]);
        }
    };

    const restoreOrigins = async (origins: OrderOrigin[]) => {
        toastRef.current = toast.loading(`Restoring ${origins.length} origin(s)...`);
        
        const promises = origins.map((origin) =>
            supaClient.from('OrderOrigin').update({ is_deleted: false }).eq('origin_id', origin.origin_id)
        );

        const results = await Promise.all(promises);
        const errors = results.filter((r) => r.error);

        if (errors.length > 0) {
            toast.update(toastRef.current, {
                render: `Failed to restore ${errors.length} origin(s)`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
        } else {
            toast.update(toastRef.current, {
                render: `Successfully restored ${origins.length} origin(s)`,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
            setSelectionModel([]);
        }
    };

    const saveAllChanges = async (dirtyRows: OriginRow[]) => {
        const count = dirtyRows.length;
        toastRef.current = toast.loading(`Saving ${count} change(s)...`);

        const results = await Promise.all(
            dirtyRows.map((row) =>
                supaClient
                    .from('OrderOrigin')
                    .update({
                        name: row.name,
                        can_deliver: row.can_deliver,
                        can_tip: row.can_tip,
                        has_order_number: row.has_order_number,
                        default_is_prepaid: row.default_is_prepaid,
                        is_prepaid_toggleable: row.is_prepaid_toggleable,
                        icon: row.icon,
                        is_third_party: row.is_third_party,
                    })
                    .eq('origin_id', row.origin_id)
                    .select('origin_id'),
            ),
        );

        const errors = results.filter((result) => result.error);
        if (errors.length > 0) {
            toast.update(toastRef.current, {
                render: `Failed to save ${errors.length} change(s)`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
            return;
        }

        toast.update(toastRef.current, {
            render: `Successfully saved ${count} change(s)`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
        });
        setDirtyRowIds(new Set());
        setOriginalRows(new Map());
    };

    const { handleConfirmation: confirmSave } = useConfirmationToast<OriginRow[]>({
        message: (origins) => `Save ${origins.length} change(s)?`,
        messageProps: { variant: 'h3' },
        position: 'center',
        renderBody: (origins) => <ExampleOrigin origin={origins[0]} />,
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (origins) => saveAllChanges(origins),
            buttonText: m.saveChanges(),
        },
        cancelProps: {
            handler: () => {},
        },
    });

    const { handleConfirmation: confirmDelete } = useConfirmationToast<OrderOrigin[]>({
        message: (origins) => `Delete ${origins.length} origin(s)?`,
        confirmProps: {
            color: 'error',
            variant: 'outlined',
            handler: (origins) => deleteOrigins(origins),
            buttonText: 'Delete',
        },
    });

    const { handleConfirmation: confirmRestore } = useConfirmationToast<OrderOrigin[]>({
        message: (origins) => `Restore ${origins.length} origin(s)?`,
        confirmProps: {
            color: 'primary',
            variant: 'contained',
            handler: (origins) => restoreOrigins(origins),
            buttonText: 'Restore',
        },
    });

    const columns: GridColDef<OriginRow>[] = [
        {
            field: 'name',
            headerName: m.name(),
            width: 150,
            editable: true,
        },
        {
            field: 'logo_src',
            headerName: m.icon(),
            width: 100,
            editable: true,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    alignItems="end"
                    height="100%"
                    spacing={2}
                    justifyContent="center"
                    className="lottie-icon-container">
                    <LogoUploader origin={params.row} disabled isAnimated />
                </Stack>
            ),
            renderEditCell: (params) => {
                const onSuccess = (downloadURL: string) => {
                    const newRow = { ...params.row, logo_src: downloadURL };
                    handleCellEdit(newRow);
                };
                return (
                    <Stack direction="row" alignItems="end" height="100%" spacing={2} justifyContent="center">
                        <LogoUploader origin={params.row} onSuccess={onSuccess} isAnimated />
                    </Stack>
                );
            },
        },
        {
            field: 'can_deliver',
            headerName: m.canDeliver(),
            width: 120,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                <CellCheckbox params={params} onChange={() => toggleBoolean(params.row, 'can_deliver')} />
            ),
        },
        {
            field: 'can_tip',
            headerName: m.canTip(),
            width: 120,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                <CellCheckbox params={params} onChange={() => toggleBoolean(params.row, 'can_tip')} />
            ),
        },
        {
            field: 'has_order_number',
            headerName: m.hasOrderNumber(),
            width: 150,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                <CellCheckbox params={params} onChange={() => toggleBoolean(params.row, 'has_order_number')} />
            ),
        },
        {
            field: 'default_is_prepaid',
            headerName: m.defaultIsPrepaid(),
            width: 150,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                <CellCheckbox params={params} onChange={() => toggleBoolean(params.row, 'default_is_prepaid')} />
            ),
        },
        {
            field: 'is_prepaid_toggleable',
            headerName: m.isPrepaidToggleable(),
            width: 180,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                <CellCheckbox params={params} onChange={() => toggleBoolean(params.row, 'is_prepaid_toggleable')} />
            ),
        },
    ];

    const hasDirtyRows = dirtyRowIds.size > 0;
    const hasSelection = selectionModel.length > 0;
    const selectedDeletedOrigins = rows.filter((r) => selectionModel.includes(r.origin_id) && r.is_deleted);

    return (
        <Stack direction="column" flex={1} overflow="hidden" width="100%" spacing={2}>
            {/* Save Changes Banner */}
            <Collapse in={hasDirtyRows}>
                <Alert
                    severity="warning"
                    icon={<SaveOutlined />}
                    action={
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                startIcon={<SaveOutlined />}
                                onClick={handleSaveAll}>
                                Save {dirtyRowIds.size} Change{dirtyRowIds.size !== 1 ? 's' : ''}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                startIcon={<UndoOutlined />}
                                onClick={handleCancelAll}>
                                Cancel All
                            </Button>
                        </Stack>
                    }>
                    <Typography variant="body2">
                        You have {dirtyRowIds.size} unsaved change{dirtyRowIds.size !== 1 ? 's' : ''}
                    </Typography>
                </Alert>
            </Collapse>

            {/* Bulk Actions Banner */}
            <Collapse in={hasSelection}>
                <Alert
                    severity="info"
                    action={
                        <Stack direction="row" spacing={1}>
                            {selectedDeletedOrigins.length > 0 && (
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RestoreOutlined />}
                                    onClick={handleRestore}>
                                    Restore {selectedDeletedOrigins.length}
                                </Button>
                            )}
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutline />}
                                onClick={handleDelete}>
                                Delete {selectionModel.length}
                            </Button>
                        </Stack>
                    }>
                    <Typography variant="body2">
                        {selectionModel.length} origin{selectionModel.length !== 1 ? 's' : ''} selected
                    </Typography>
                </Alert>
            </Collapse>

            <DataGrid
                sx={{
                    '& .row-is-dirty': { 
                        bgcolor: 'warning.light',
                        '&:hover': { bgcolor: 'warning.main' }
                    },
                    '& .row-is-deleted': {
                        color: 'text.disabled',
                        textDecoration: 'line-through',
                    },
                    '.MuiDataGrid-columnHeader': { textTransform: 'capitalize' },
                }}
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={setSelectionModel}
                processRowUpdate={handleCellEdit}
                getRowSpacing={() => ({ top: 5, bottom: 5 })}
                getRowId={(row) => row.origin_id}
                getRowClassName={(params) => {
                    const isDirty = dirtyRowIds.has(params.id);
                    const isDeleted = params.row.is_deleted;
                    if (isDirty) return 'row-is-dirty';
                    if (isDeleted) return 'row-is-deleted';
                    return '';
                }}
            />
        </Stack>
    );
};
