import { Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { getDrawerFullName } from '../../utils';
import { OrderDashboardContext } from '../../context/OrderDashboardContext';

export const QuickInfoArea = () => {
    const { openDrawer: drawer } = useContext(OrderDashboardContext);
    if (!drawer) {
        return <Stack sx={{ height: 150 }}></Stack>;
    }
    const fullName = getDrawerFullName(drawer);
    return (
        <Stack sx={{ height: 150 }}>
            <Typography>{fullName} info goes here!</Typography>
        </Stack>
    );
};
