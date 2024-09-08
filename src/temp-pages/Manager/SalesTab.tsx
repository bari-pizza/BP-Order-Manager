import { Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { SideBar } from '../../components/SideBar';

import { SalesVsTimeChart as Table1 } from './Charts/SalesVsTime';

export const SalesTab = () => {
    const portalContainer = useRef<HTMLDivElement | null>(null);
    const [activeTable, setActiveTable] = useState<'table1' | 'table2'>('table1');

    return (
        <Stack justifyContent="center" gap={2} direction="row" width="100%">
            {activeTable === 'table1' && <Table1 portalContainer={portalContainer} />}
            {activeTable === 'table2' && <div>Table 2 goes here</div>}
            <SideBar width={300}>
                <Button onClick={() => setActiveTable('table1')}>Table 1</Button>
                <Button onClick={() => setActiveTable('table2')}>Table 2</Button>
                <div ref={portalContainer} />
            </SideBar>
        </Stack>
    );
};
