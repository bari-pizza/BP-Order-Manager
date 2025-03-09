import { Box, Skeleton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';
import { PointOfSale as SalesIcon, Garage as DriversIcon } from '@mui/icons-material';
import { ManagerDashboardContext } from '../../context/ManagerDashboardContext';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { useDrivers } from '../../hooks/data/useDrivers';
import { ManagerDashboardTabName } from '../../typesAndValidators';
import { DrawersTab } from './Tabs/DrawersTab';
import { SalesTab } from './Tabs/SalesTab';
import { OrdersTab } from './Tabs/OrdersTab';
import { CardsTab } from './Tabs/CardsTab';
import { devOnly } from '../../utils';

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
            className="hover-scroll"
            role="tabpanel"
            hidden={value !== tabName}
            id={`simple-tabpanel-${tabName}`}
            aria-labelledby={`simple-tab-${tabName}`}
            {...other}>
            <div className="hover-scroll-content">{value === tabName && <Box sx={{ p: 3 }}>{children}</Box>}</div>
        </div>
    );
}

type TabName = ManagerDashboardTabName;

export const ManagerDashboard = () => {
    const { orders, drawer, summaries, cashTransfers, businessDay } = useOrdersDrawersTickets();
    const { drawers, origins } = useBariPizzaContext();
    const { drivers } = useDrivers();
    const { value: tabName, setValue: setTabName } = useLocalStorage<'managerDashboardTabName'>(
        'managerDashboardTabName',
        'drawers',
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
                cashTransfers,
                drawers: {
                    all: drawers,
                    onClick: drawer.onClick,
                    current: drawer.current,
                    close: drawer.close,
                    reOpen: drawer.reOpen,
                },
                origins,
                summaries,
                drivers: {
                    all: drivers.all,
                    todays: drivers.todays,
                    current: drivers.current,
                    available: drivers.available,
                    add: drivers.add,
                    remove: drivers.remove, // some supabase mutation
                    handleClick: drivers.handleClick,
                },
                // all these properties should eventually come from useDrivers
                combinedDrawersAndDrivers: drawers.concat(drivers.todays),
                businessDay,
            }}>
            <Stack height="100vh" width="100%" sx={{ overflowY: 'hidden' }}>
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
                        {devOnly(<Tab value="sales" label="Sales" icon={<SalesIcon />} iconPosition="start" />)}
                        <Tab value="drawers" label="Drawers" icon={<DriversIcon />} iconPosition="start" />
                        <Tab value="orders" label="Orders" icon={<DriversIcon />} iconPosition="start" />
                        <Tab value="cards" label="Credit Cards" icon={<DriversIcon />} iconPosition="start" />
                        {devOnly(<Tab value="settings" label="Settings" icon={<DriversIcon />} iconPosition="start" />)}
                    </Tabs>
                </Box>
                {devOnly(
                    <TabPanel tabName="sales" value={tabName}>
                        <SalesTab />
                    </TabPanel>,
                )}
                <TabPanel tabName="drawers" value={tabName}>
                    <DrawersTab />
                </TabPanel>
                <TabPanel tabName="orders" value={tabName}>
                    <OrdersTab />
                </TabPanel>
                <TabPanel tabName="cards" value={tabName}>
                    <CardsTab />
                </TabPanel>
                {devOnly(
                    <TabPanel tabName="settings" value={tabName}>
                        Settings go here!
                    </TabPanel>,
                )}
            </Stack>
        </ManagerDashboardContext.Provider>
    );
};

export const ManagerDashboardSkeleton = () => {
    return <Skeleton variant="rectangular" height="100%" width="100%" />;
};
