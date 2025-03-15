import { Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Resource } from '../../../typesAndValidators';
import { ResourceUploader } from '../ResourceUploader';

export const ResourcesTable = ({ resources }: { resources: Resource[] }) => {
    const rows = resources;

    const columns: GridColDef<Resource>[] = [
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
        },
        {
            field: 'src',
            headerName: 'Icon',
            width: 200,
            editable: true,
            renderCell: (params) => {
                // return <ResourceUploader resource={params.row} disabled />;
                const onSuccess = (downloadURL: string) => {
                    console.log(`saving ${downloadURL}`);
                    params.api.setEditCellValue({ id: params.id, field: 'src', value: downloadURL });
                };
                return <ResourceUploader resource={params.row} onSuccess={onSuccess} />;
            },
            // renderEditCell: (params) => {
            //     const onSuccess = (downloadURL: string) => {
            //         console.log(`saving ${downloadURL}`);
            //         params.api.setEditCellValue({ id: params.id, field: 'src', value: downloadURL });
            //     };
            //     return <ResourceUploader resource={params.row} onSuccess={onSuccess} />;
            // },
        },
    ];
    return (
        <Stack direction="column" minHeight="300px" width="100%">
            <DataGrid
                rows={rows}
                columns={columns}
                disableVirtualization
                getRowId={(row) => row.title}
                getRowSpacing={() => ({ top: 5, left: 0, bottom: 10 })}
                getRowClassName={() => {
                    return 'lottie-icon-container';
                }}
                hideFooter
            />
        </Stack>
    );
};
