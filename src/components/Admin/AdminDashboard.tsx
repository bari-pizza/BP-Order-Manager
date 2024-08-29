import { Skeleton } from '@mui/material';
// import { Drawer, DriverDrawer, Profile } from '../../typesAndValidators';

/* TODO: ALL THE FOLLOWING
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

export const AdminDashboard = () => {
    return <div>Admin Dashboard</div>;
};

export const AdminDashboardSkeleton = () => {
    return <Skeleton variant="rectangular" width="100%" height="100%" />;
};
