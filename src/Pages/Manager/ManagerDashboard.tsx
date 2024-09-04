import { Box, Skeleton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';
import { PointOfSale as SalesIcon, Garage as DriversIcon } from '@mui/icons-material';
import { DriversTab } from './DriversTab';
import { ManagerDashboardContext } from '../../context/ManagerDashboardContext';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { useDrivers } from '../../hooks/data/useDrivers';
import { DriverDrawer, ManagerDashboardTabName } from '../../typesAndValidators';
import { SalesTab } from './SalesTab';

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

type TabName = ManagerDashboardTabName;

export const ManagerDashboard = () => {
    const { orders, drawer } = useOrdersDrawersTickets();
    const { drawers, origins } = useBariPizzaContext();
    const { drivers } = useDrivers();
    const { value: tabName, setValue: setTabName } = useLocalStorage<'managerDashboardTabName'>(
        'managerDashboardTabName',
        'drivers',
    );
    const theme = useTheme();

    const handleChange = (tab: TabName) => {
        setTabName(tab);
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
        <ManagerDashboardContext.Provider
            value={{
                orders,
                drawers: {
                    all: drawers,
                    onClick: drawer.onClick,
                },
                origins,
                drivers: {
                    all: drivers.all,
                    todays: drivers.todays,
                    current: drivers.current,
                    available: drivers.available,
                    add: drivers.add,
                    remove: drivers.remove, // some supabase mutation
                    close: (driver: DriverDrawer) => {
                        console.log('close driver', driver);
                    }, // some supabase mutation
                    reOpen: () => {}, // some supabase mutation
                    handleClick: drivers.handleClick,
                },
                // all these properties should eventually come from useDrivers
            }}>
            <Stack height="100vh" width="100%">
                <Stack m={2}>
                    <Typography
                        variant="h3"
                        color="primary"
                        sx={{ textShadow: `1px 1px 1px ${theme.palette.primary.dark}` }}>
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
                    <SalesTab />
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
        </ManagerDashboardContext.Provider>
    );
};

export const ManagerDashboardSkeleton = () => {
    return <Skeleton variant="rectangular" height="100%" width="100%" />;
};
