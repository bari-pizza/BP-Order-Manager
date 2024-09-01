import { Drawer, DriverDrawer } from '../../typesAndValidators';
import { useNavigate } from 'react-router-dom';

interface Props {
    tab?: string;
    driver?: Drawer | DriverDrawer;
}

const useNavigateToManagerDashboard = () => {
    const navigate = useNavigate();
    return ({ tab, driver }: Props) => {
        // if tab is provided, set the tabName in localStorage
        if (tab) {
            localStorage.setItem('managerDashboardTabName', tab);
        }

        // if driver is provided, set the driver in localStorage
        if (driver) {
            localStorage.setItem('openDrawer', JSON.stringify(driver));
        }

        // navigate to /manager
        navigate('/manager');
    };
};

export default useNavigateToManagerDashboard;
