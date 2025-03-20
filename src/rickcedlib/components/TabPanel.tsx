import { Stack } from '@mui/material';

interface TabPanelProps<TabName> {
    children?: React.ReactNode;
    tabName: TabName;
    value: TabName;
}

// export const TabPanel = <string>(props: TabPanelProps<TabName>) => {
export const TabPanel = (props: TabPanelProps<string>) => {
    const { children, value, tabName, ...other } = props;

    return (
        <div
            style={{
                flex: '1',
                overflow: 'hidden',
                margin: '24px',
            }}
            role="tabpanel"
            hidden={value !== tabName}
            id={`simple-tabpanel-${tabName}`}
            aria-labelledby={`simple-tab-${tabName}`}
            {...other}>
            {value === tabName && <Stack sx={{ height: '100%' }}>{children}</Stack>}
        </div>
    );
};
