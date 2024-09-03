import { Stack } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllEmployees } from '../../supabaseQueries';
import { EmployeesTable } from './EmployeesTable';
import { Profile } from '../../typesAndValidators';
import { useBariPizzaContext } from '../../hooks/data/useContextData';

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
        </Stack>
    );
};

// interface NewEmployeeFormProps {
//     close: () => void;
//     isOpen: boolean;
// }

// type FormValues = NewProfile & {
//     is_cashier: boolean;
//     is_driver: boolean; // will determine if a drawer is created for the employee
// };

// got rid of this because employee should make their own account
// admin should then update their profile
// const NewEmployeeForm = ({ close, isOpen }: NewEmployeeFormProps) => {
//     const {
//         handleSubmit,
//         control,
//         reset,
//         formState: { errors },
//         setError,
//     } = useForm<FormValues>({
//         defaultValues: {
//             first_name: '',
//             last_name: '',
//             email: '',
//             phone: '',
//             is_driver: false,
//             is_cashier: false,
//             is_admin: false,
//             is_manager: false,
//         },
//     });

//     const queryClient = useQueryClient();

//     const createNewEmployeeMutation = useMutation({
//         mutationFn: ({ newEmployee, isDriver }: { newEmployee: NewProfile; isDriver: boolean }) =>
//             createNewEmployee(newEmployee, isDriver),
//         onSuccess: (data) => {
//             console.log({ data });
//             close();
//             queryClient.invalidateQueries({ queryKey: ['profiles'] });
//         },
//         onError: (error) => {
//             console.error('Issue creating new employee', error);
//             setError('root', { message: "Couldn't create new employee" });
//         },
//     });

//     const onSubmit: SubmitHandler<FormValues> = async (data) => {
//         console.log(data);
//         const newEmployee: NewProfile = {
//             first_name: data.first_name,
//             last_name: data.last_name,
//             email: data.email,
//             phone: data.phone,
//             is_cashier: data.is_cashier,
//             is_admin: data.is_admin,
//             is_manager: data.is_manager,
//             avatar_src: null,
//         };
//         createNewEmployeeMutation.mutate({ newEmployee, isDriver: data.is_driver });
//     };

//     const onError: SubmitErrorHandler<FieldErrors> = (fields) => {
//         console.log({ fields });
//         console.error('Invalid form submission');
//     };

//     const onCancel = () => {
//         reset();
//         close();
//     };
//     return (
//         <Dialog open={isOpen} onClose={close}>
//             <DialogTitle>Add Employee</DialogTitle>
//             <DialogContent>
//                 {errors.root && <Typography color="error">{errors.root.message}</Typography>}
//                 <Stack direction="column" spacing={2} mt={2}>
//                     <Controller
//                         name="first_name"
//                         control={control}
//                         rules={{ required: 'Required' }}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="First Name"
//                                 error={!!errors.first_name}
//                                 helperText={errors.first_name?.message}
//                             />
//                         )}
//                     />
//                     <Controller
//                         name="last_name"
//                         control={control}
//                         rules={{ required: 'Required' }}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="Last Name"
//                                 error={!!errors.last_name}
//                                 helperText={errors.last_name?.message}
//                             />
//                         )}
//                     />
//                     <Controller
//                         name="email"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="Email"
//                                 error={!!errors.email}
//                                 helperText={errors.email?.message}
//                             />
//                         )}
//                     />
//                     <Controller
//                         name="phone"
//                         control={control}
//                         rules={{ validate: (value) => value?.length === 10 || 'Must be 10 digits' }}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="Phone"
//                                 error={!!errors.phone}
//                                 helperText={errors.phone?.message}
//                             />
//                         )}
//                     />
//                     <Tooltip
//                         placement="right"
//                         arrow
//                         slotProps={{ tooltip: { sx: { padding: '20px' } } }}
//                         title={
//                             <Typography variant="body1">
//                                 <SmartLink to="/info/roles" target="_blank">
//                                     Read more about roles here
//                                 </SmartLink>
//                             </Typography>
//                         }>
//                         <Stack direction="row" gap={2} alignItems="center" width="min-content">
//                             <Typography variant="h6">Roles</Typography>
//                             <InfoIcon />
//                         </Stack>
//                     </Tooltip>
//                     <Stack direction="row" gap={2}>
//                         <Controller
//                             name="is_driver"
//                             control={control}
//                             render={({ field }) => (
//                                 <FormControlLabel control={<Checkbox {...field} />} label="Driver" />
//                             )}
//                         />

//                         <Controller
//                             name="is_cashier"
//                             control={control}
//                             render={({ field }) => (
//                                 <FormControlLabel control={<Checkbox {...field} />} label="Cashier" />
//                             )}
//                         />
//                     </Stack>
//                     <Divider flexItem />
//                     <Stack direction="row" gap={2}>
//                         <Controller
//                             name="is_admin"
//                             control={control}
//                             render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Admin" />}
//                         />
//                         <Controller
//                             name="is_manager"
//                             control={control}
//                             render={({ field }) => (
//                                 <FormControlLabel control={<Checkbox {...field} />} label="Manager" />
//                             )}
//                         />
//                     </Stack>
//                 </Stack>
//             </DialogContent>
//             <DialogActions>
//                 <Button variant="outlined" color="error" onClick={onCancel}>
//                     Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleSubmit(onSubmit, onError)}>
//                     Submit
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
