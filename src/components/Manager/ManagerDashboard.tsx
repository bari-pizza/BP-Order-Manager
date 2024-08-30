import { Box, Skeleton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { PointOfSale as SalesIcon, Garage as DriversIcon } from '@mui/icons-material';
import { DriversTab } from './DriversTab';

/*    TODO: About Today
        Sales
            Charts
            Reports
        Drivers
            Add driver
            Remove driver (only if not in use)
            Close driver (locks driver)
            Open driver (unlocks driver)
        Orders
            Allow for order deletion
*/

// Render Driver Card - one that says add driver

interface TabPanelProps {
    children?: React.ReactNode;
    tabName: TabName;
    value: TabName;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, tabName, ...other } = props;

    return (
        <div
            style={{
                height: '100%',
            }}
            role="tabpanel"
            hidden={value !== tabName}
            id={`simple-tabpanel-${tabName}`}
            aria-labelledby={`simple-tab-${tabName}`}
            {...other}>
            {value === tabName && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

type TabName = 'sales' | 'drivers' | 'orders' | 'settings';

export const ManagerDashboard = () => {
    const [tabName, setTabName] = useState<TabName>('sales');
    const theme = useTheme();

    const handleChange = (tab: TabName) => {
        setTabName(tab);
        console.log(tab);
    };

    const sx = {
        '&.MuiTabs-root': {
            '& .Mui-selected': {
                color: 'white',
                backgroundColor: theme.palette.primary.main,
            },
        },
        '& .MuiTab-root': {
            background: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.dark,
            height: '6px',
        },
    };

    return (
        <Stack height="100vh" width="100%">
            <Stack m={2}>
                <Typography
                    variant="h1"
                    color="primary"
                    sx={{ textShadow: `0px 3px 0px ${theme.palette.primary.dark}` }}>
                    Manager Dashboard
                </Typography>
            </Stack>
            <Box>
                <Tabs value={tabName} onChange={(_, tab) => handleChange(tab)} variant="fullWidth" sx={sx}>
                    <Tab value="sales" label="Sales" icon={<SalesIcon />} iconPosition="start" />
                    <Tab value="drivers" label="Drivers" icon={<DriversIcon />} iconPosition="start" />
                    <Tab value="orders" label="Orders" icon={<DriversIcon />} iconPosition="start" />
                    <Tab value="settings" label="Settings" icon={<DriversIcon />} iconPosition="start" />
                </Tabs>
            </Box>
            <TabPanel tabName="sales" value={tabName}>
                Sales go here!
            </TabPanel>
            <TabPanel tabName="drivers" value={tabName}>
                <DriversTab />
            </TabPanel>
            <TabPanel tabName="orders" value={tabName}>
                Orders go here!
            </TabPanel>
            <TabPanel tabName="settings" value={tabName}>
                Settings go here!
            </TabPanel>
        </Stack>
    );
};

export const ManagerDashboardSkeleton = () => {
    return <Skeleton variant="rectangular" height="100%" width="100%" />;
};
