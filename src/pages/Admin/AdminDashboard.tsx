import { Box, Skeleton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';
import { PointOfSale as SalesIcon, Garage as DriversIcon } from '@mui/icons-material';
import { ManagerDashboardContext as AdminDashboardContext } from '../../context/ManagerDashboardContext';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { useDrivers } from '../../hooks/data/useDrivers';
import { Driver_Drawer, AdminDashboardTabName } from '../../typesAndValidators';
import { EmployeesTab } from './EmployeesTab';
import { ThirdPartiesTab } from './ThirdPartiesTab';
import { Todo } from '../../components/Base/Todo';
import { SettingsTab } from './SettingsTab';

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

type TabName = AdminDashboardTabName;

export const AdminDashboard = () => {
    const { orders, drawer } = useOrdersDrawersTickets();
    const { drawers, origins } = useBariPizzaContext();
    const { drivers } = useDrivers();
    const { value: tabName, setValue: setTabName } = useLocalStorage<'adminDashboardTabName'>(
        'adminDashboardTabName',
        'employees',
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
        <AdminDashboardContext.Provider
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
                    close: (driver: Driver_Drawer) => {
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
                        Admin Dashboard
                    </Typography>
                </Stack>
                <Box>
                    <Tabs value={tabName} onChange={(_, tab) => handleChange(tab)} variant="fullWidth" sx={sx}>
                        <Tab value="employees" label="Employees" icon={<SalesIcon />} iconPosition="start" />
                        <Tab value="third_parties" label="Third Parties" icon={<DriversIcon />} iconPosition="start" />
                        <Tab value="orders" label="Orders" icon={<DriversIcon />} iconPosition="start" />
                        <Tab value="settings" label="Settings" icon={<DriversIcon />} iconPosition="start" />
                    </Tabs>
                </Box>
                <TabPanel tabName="employees" value={tabName}>
                    <EmployeesTab />
                </TabPanel>
                <TabPanel tabName="third_parties" value={tabName}>
                    <ThirdPartiesTab />
                </TabPanel>
                <TabPanel tabName="orders" value={tabName}>
                    <Todo>Create orders tab</Todo>
                </TabPanel>
                <TabPanel tabName="settings" value={tabName}>
                    <SettingsTab />
                </TabPanel>
            </Stack>
        </AdminDashboardContext.Provider>
    );
};

/* TODO: ADMIN DASHBOARD


TODO: should show workers (profiles)
    firstName, lastName, phone, email, is_admin, is_manager, is_driver
    is_driver is not a field - it would be determined if a DriverDrawer with .driver_id === profile.id
    allows admin to create new workers or rename existing ones

    

TODO: should show registers (Drawers.drawer_type === "register")
    allows admin to create new registers or rename existing ones

TODO: should show order origins
    Bari Pizza should be disabled
    allows you to create new origins or rename existing ones
    
TODO: allow us to create reports
    allows to choose day / date-range
    
    day tables
        orders table (toggleable)
        payments table (toggleable)

    daily/weekly/monthly report
        Sales, cc sales, sales by origin, sales by driver, etc         
    
*/

export const AdminDashboardSkeleton = () => {
    return <Skeleton variant="rectangular" width="100%" height="100%" />;
};
