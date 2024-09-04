import { Stack } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderOrigin } from '../../typesAndValidators';
import { dummyQueryFn } from '../../supabaseQueries';
import { CellCheckbox, CellEditCheckbox } from '../../components/Base/DataGrid/CellCheckbox';
import { CellEditTextField } from '../../components/Base/DataGrid/CellTextField';
import { createCellActions } from '../../components/Base/DataGrid/createCellActions';

type ThirdParty = Omit<OrderOrigin, 'is_third_party'> & {
    is_third_party: true;
};

export const ThirdPartiesTable = ({ thirdParties }: { thirdParties: ThirdParty[] }) => {
    const [rows, setRows] = useState<ThirdParty[]>(thirdParties);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const queryClient = useQueryClient();

    const updateThirdPartyMutation = useMutation({
        mutationFn: (thirdParty: ThirdParty) => {
            // const { is_driver, ...profile } = employee;
            // return updateEmployee(profile, is_driver);
            //TODO: return updateThirdParty(thirdParty);
            console.log('thirdParty', thirdParty);
            return dummyQueryFn();
        },
        onSuccess: (data) => {
            // const { profile, driver } = data;
            // const updatedRow = {
            //     ...profile,
            //     is_driver: !driver?.is_deleted,
            // };
            // setRows((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
            console.log({ data });
            queryClient.invalidateQueries({ queryKey: ['origins'] });
        },
        onError: (error) => {
            console.log({ error });
        },
    });

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as ThirdParty),
            // isNew: false
        };
        alert('this should open a dialog with a preview of the changes, allowing admin to accept or reject');
        updateThirdPartyMutation.mutate(updatedRow);
        // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setRows((prev) => prev.map((row) => (row.origin_id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
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
            field: 'can_deliver',
            headerName: 'Can Deliver',
            width: 150,
            editable: true,
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
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="can_tip" />;
            },
        },
        {
            field: 'default_is_prepaid',
            headerName: 'Default Is Prepaid',
            width: 150,
            editable: true,
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="default_is_prepaid" />;
            },
        },
        {
            field: 'has_order_number',
            headerName: 'Has Order Number',
            width: 150,
            editable: true,
            renderCell: (params) => {
                return <CellCheckbox params={params} />;
            },
            renderEditCell: (params) => {
                return <CellEditCheckbox params={params} field="has_order_number" />;
            },
        },
        {
            field: 'icon',
            headerName: 'Icon',
            width: 150,
            editable: true,
        },
        {
            field: 'is_prepaid_toggleable',
            headerName: 'Is Prepaid Toggleable',
            width: 150,
            editable: true,
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
                getRowId={(row) => row.origin_id}
            />
        </Stack>
    );
};
