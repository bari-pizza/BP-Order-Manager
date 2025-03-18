import { Box, Skeleton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useLocalStorage } from '../../hooks/data/useLocalStorage';
import { ManagerDashboardContext as AdminDashboardContext } from '../../context/ManagerDashboardContext';
import { useOrdersDrawersTickets } from '../../hooks/data/useOrdersDrawersTickets';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { useDrivers } from '../../hooks/data/useDrivers';
import { Driver_Drawer, AdminDashboardTabName, Drawer } from '../../typesAndValidators';
import { EmployeesTab } from './Tabs/EmployeesTab';
import { OriginsTab } from './Tabs/OriginsTab';
import { SettingsTab } from './Tabs/SettingsTab';
import { Suspense } from 'react';
import { GlobeLottieIcon, SettingsLottieIcon, StaffLottieIcon } from '../../rickcedlib/LottieIcons';
import { ResourcesTab } from './Tabs/ResourcesTab';
// @ts-expect-error remove if module declaration can be fixed
import { m } from '../../paraglide/messages';

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
    const { orders, drawer, summaries, cashTransfers, businessDay } = useOrdersDrawersTickets();
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
                businessDay,
                cashTransfers,
                orders,
                drawers: {
                    all: drawers,
                    onClick: drawer.onClick,
                    current: drawer.current,
                    close: (drawer: Drawer | Driver_Drawer) => {
                        console.log('close drawer', drawer);
                    }, // some supabase mutation
                    reOpen: () => {}, // some supabase mutation
                },
                origins,
                summaries,
                combinedDrawersAndDrivers: [...drawers, ...drivers.todays],
                drivers: {
                    all: drivers.all,
                    todays: drivers.todays,
                    current: drivers.current,
                    available: drivers.available,
                    add: drivers.add,
                    remove: drivers.remove, // some supabase mutation
                    handleClick: drivers.handleClick,
                },
            }}>
            <Stack height="100vh" width="100%">
                <Stack m={2}>
                    <Typography
                        variant="h3"
                        color="primary"
                        sx={{ textShadow: `1px 1px 1px ${theme.palette.primary.dark}` }}>
                        {m.adminDashboard()}
                    </Typography>
                </Stack>
                <Box>
                    <Tabs value={tabName} onChange={(_, tab) => handleChange(tab)} variant="fullWidth" sx={sx}>
                        <Tab
                            value="employees"
                            label="Employees"
                            icon={<StaffLottieIcon autoPlay={tabName === 'employees'} />}
                            iconPosition="start"
                        />
                        <Tab
                            value="origins"
                            label="Origins"
                            icon={<GlobeLottieIcon autoPlay={tabName === 'origins'} />}
                            iconPosition="start"
                        />
                        <Tab
                            value="resources"
                            label="Resources"
                            icon={<SettingsLottieIcon autoPlay={tabName === 'resources'} />}
                            iconPosition="start"
                        />
                        ,
                        <Tab
                            value="settings"
                            label="Settings"
                            icon={<SettingsLottieIcon autoPlay={tabName === 'settings'} />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>
                <Suspense fallback={<Skeleton variant="rectangular" height="100%" />}>
                    <TabPanel tabName="employees" value={tabName}>
                        <EmployeesTab />
                    </TabPanel>
                    <TabPanel tabName="origins" value={tabName}>
                        <OriginsTab />
                    </TabPanel>
                    <TabPanel tabName="resources" value={tabName}>
                        <ResourcesTab />
                    </TabPanel>
                    ,
                    <TabPanel tabName="settings" value={tabName}>
                        <SettingsTab />
                    </TabPanel>
                </Suspense>
            </Stack>
        </AdminDashboardContext.Provider>
    );
};

/* TODO: ADMIN DASHBOARD

    

TODO: should show registers (Drawers.drawer_type === "register")
    allows admin to create new registers or rename existing ones
    
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
