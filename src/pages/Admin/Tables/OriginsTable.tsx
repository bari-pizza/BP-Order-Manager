import { Stack } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { OrderOrigin } from '../../../typesAndValidators';
import { CellCheckbox, CellEditCheckbox } from '../../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../../components/Base/DataGrid/createCellActions';
import { useDataGrid } from '../../../hooks/ui/useDataGrid';
import { LogoUploader } from '../LogoUploader';
import { useOrderOriginCRUD } from '../../../api/orderOrigin';

export const OriginsTable = ({ origins }: { origins: OrderOrigin[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid<OrderOrigin>({ data: origins });
    const { orderOriginMutations } = useOrderOriginCRUD({ queryKey: ['origins'] });

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = {
            ...(newRow as OrderOrigin),
        };
        // alert('this should open a dialog with a preview of the changes, allowing admin to accept or reject');
        orderOriginMutations.update(updatedRow as OrderOrigin);
        setRows((prev) => prev.map((row) => (row.origin_id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<OrderOrigin>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edit',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => createCellActions(id, rowModesModel, setRowModesModel),
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
            editable: false,
            // renderCell: (params) => {
            //     return <LogoUploader origin={params.row} disabled />;
            // },
            renderCell: (params) => {
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
                    '& .MuiDataGrid-cell--editing': { padding: 0 },
                }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowId={(row) => row.origin_id}
            />
        </Stack>
    );
};
