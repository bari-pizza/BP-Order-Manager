import { Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Resource } from '../../../typesAndValidators';
import { ResourceUploader } from '../ResourceUploader';
import { m } from '../../../paraglide/messages';

export const ResourcesTable = ({ resources }: { resources: Resource[] }) => {
    const rows = resources;

    const columns: GridColDef<Resource>[] = [
        {
            field: 'title',
            headerName: m.title(),
            flex: 4,
        },
        {
            field: 'src',
            headerName: 'Icon',
            headerAlign: 'center',
            flex: 6,
            editable: true,
            renderCell: (params) => {
                // return <ResourceUploader resource={params.row} disabled />;
                const onSuccess = (downloadURL: string) => {
                    console.log(`saving ${downloadURL}`);
                    params.api.setEditCellValue({ id: params.id, field: 'src', value: downloadURL });
                };
                return (
                    <Stack direction="row" alignItems="center" height="100%" spacing={2} justifyContent="center">
                        <ResourceUploader resource={params.row} onSuccess={onSuccess} />
                    </Stack>
                );
            },
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
                rowHeight={100}
            />
        </Stack>
    );
};
