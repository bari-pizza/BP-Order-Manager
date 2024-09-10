// import { useState } from 'react';
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
import { OrderWithFullDetails } from '../../typesAndValidators';
// import { updateEmployee } from '../../supabaseQueries';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { CellEditCheckbox, CellCheckbox } from '../../components/Base/DataGrid/CellCheckbox';
// import { CellEditTextField } from '../../components/Base/DataGrid/CellTextField';
// import { createCellActions } from '../../components/Base/DataGrid/createCellActions';
import { useDataGrid } from '../../hooks/ui/useDataGrid';

export const OrdersTable = ({ orders }: { orders: OrderWithFullDetails[] }) => {
    const { rows, setRows, rowModesModel, setRowModesModel } = useDataGrid({ data: orders });
    // const [rows, setRows] = useState<Order_Payment[]>(orders);
    // const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    // const queryClient = useQueryClient();

    // const updateEmployeeMutation = useMutation({
    //     mutationFn: (employee: Employee) => {
    //         const { is_driver, ...profile } = employee;
    //         return updateEmployee(profile, is_driver);
    //     },
    //     onSuccess: (data) => {
    //         const { profile, driver } = data[0];
    //         const updatedRow = {
    //             ...profile,
    //             is_driver: !driver?.is_deleted,
    //         };
    //         setRows((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    //         queryClient.invalidateQueries({ queryKey: ['profiles'] });
    //     },
    //     onError: (error) => {
    //         console.log({ error });
    //     },
    // });

    const processRowUpdate = (newRow: GridRowModel) => {
        console.log('processRowUpdate', newRow);
        const updatedRow = {
            ...(newRow as OrderWithFullDetails),
            // isNew: false
        };
        // updateEmployeeMutation.mutate(updatedRow);
        // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setRows((prev) => prev.map((row) => (row.order_id === newRow.order_id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<OrderWithFullDetails>[] = [
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     width: 100,
        //     cellClassName: 'actions',
        //     getActions: ({ id }) => {
        //         return createCellActions(id, rowModesModel, setRowModesModel);
        //     },
        // },

        {
            field: 'number/name',
            headerName: '#',
            width: 125,
            renderCell: (params) => {
                const { row } = params;
                const { order_number, order_name } = row;
                return order_number ?? order_name;
            },
        },
        {
            field: 'origin',
            headerName: 'Origin',
            width: 125,
            renderCell: (params) => {
                const { row } = params;
                const { origin } = row;
                return origin?.name;
            },
        },
        {
            field: 'drawer',
            headerName: 'Drawer',
            width: 150,
            renderCell: (params) => {
                const { row } = params;
                const { drawer, driver } = row;
                return drawer?.name ?? driver?.name ?? 'Unassigned';
            },
        },
        {
            field: 'total_in_cents',
            headerName: 'Total',
            width: 150,
            renderCell: (params) => {
                const { row } = params;
                const { total_in_cents } = row;
                return `$${(total_in_cents / 100).toFixed(2)}`;
            },
        },
        {
            field: 'is_paid',
            headerName: 'Paid',
            width: 125,
            renderCell: (params) => {
                const { row } = params;
                const { payments, total_in_cents } = row;
                const totalPaid = payments.reduce((acc: number, curr) => acc + curr.amount_in_cents, 0);
                const is_paid = totalPaid === total_in_cents;
                return is_paid ? 'Yes' : 'No';
            },
        },
        {
            field: 'order_type',
            headerName: 'Type',
            width: 125,
        },
        {
            field: 'is_locked',
            headerName: 'Locked',
            width: 125,
            renderCell: () => {
                return 'No';
            },
        },
        // {
        //     field: 'last_name',
        //     headerName: 'Last Name',
        //     width: 150,
        //     editable: true,
        //     renderEditCell: (params) => {
        //         return <CellEditTextField params={params} field="last_name" />;
        //     },
        // },
        // {
        //     field: 'email',
        //     headerName: 'Email',
        //     width: 200,
        // },
        // {
        //     field: 'phone',
        //     headerName: 'Phone',
        //     width: 150,
        //     editable: true,
        //     renderEditCell: (params) => {
        //         return <CellEditTextField params={params} field="phone" />;
        //     },
        // },
        // {
        //     field: 'is_admin',
        //     headerName: 'Admin',
        //     width: 125,
        //     editable: true,
        //     renderCell: (params) => {
        //         return <CellCheckbox params={params} />;
        //     },
        //     renderEditCell: (params) => {
        //         return <CellEditCheckbox params={params} field="is_admin" />;
        //     },
        // },
        // {
        //     field: 'is_manager',
        //     headerName: 'Manager',
        //     width: 125,
        //     editable: true,

        //     renderCell: (params) => {
        //         return <CellCheckbox params={params} />;
        //     },
        //     renderEditCell: (params) => {
        //         return <CellEditCheckbox params={params} field="is_manager" />;
        //     },
        // },
        // {
        //     field: 'is_driver',
        //     headerName: 'Driver',
        //     width: 125,
        //     editable: true,
        //     renderCell: (params) => {
        //         return <CellCheckbox params={params} />;
        //     },
        //     renderEditCell: (params) => {
        //         return <CellEditCheckbox params={params} field="is_driver" />;
        //     },
        // },
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
                getRowId={(row) => row.order_id}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={(params) => {
                    const isEditing = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                    return isEditing ? 'row-is-edit' : '';
                }}
            />
        </Stack>
    );
};
