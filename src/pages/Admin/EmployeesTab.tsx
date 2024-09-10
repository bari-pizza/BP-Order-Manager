import { Stack } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllEmployees } from '../../supabaseQueries';
import { EmployeesTable } from './EmployeesTable';
import { Profile } from '../../typesAndValidators';
import { useBariPizzaContext } from '../../hooks/data/useContextData';
import { Todo } from '../../components/Base/Todo';

const sortEmployees = (a: Profile, b: Profile) => {
    const aFirstName = a.first_name?.toLowerCase() || '';
    const bFirstName = b.first_name?.toLowerCase() || '';
    const aLastName = a.last_name?.toLowerCase() || '';
    const bLastName = b.last_name?.toLowerCase() || '';

    if (aFirstName < bFirstName) {
        return -1;
    }
    if (aFirstName > bFirstName) {
        return 1;
    }
    if (aLastName < bLastName) {
        return -1;
    }
    if (aLastName > bLastName) {
        return 1;
    }
    return 0;
};

export const EmployeesTab = () => {
    const { drivers } = useBariPizzaContext();
    const { data: profiles } = useSuspenseQuery({
        queryKey: ['profiles'],
        queryFn: () => getAllEmployees(),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
    const employees = profiles
        .map((employee) => {
            const driver = drivers.find((driver) => {
                return driver.driver.id === employee.id;
            });
            return {
                ...employee,
                is_driver: driver !== undefined,
            };
        })
        .sort(sortEmployees);
    return (
        <Stack direction="column">
            <EmployeesTable employees={employees} />
            <Todo message="This may not be necessary">Add a button to add an employee</Todo>
        </Stack>
    );
};
