import { GridRowModesModel } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';

export const useDataGrid = <T,>({ data }: { data: T[] }) => {
    const [rows, setRows] = useState<T[]>(data);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    // Memoize rows so they only recompute when `data` changes
    const memoizedRows = useMemo(() => data, [data]);

    useEffect(() => {
        setRows(memoizedRows);
    }, [memoizedRows]);

    return {
        rows,
        setRows,
        rowModesModel,
        setRowModesModel,
    };
};
