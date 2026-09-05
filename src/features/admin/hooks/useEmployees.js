import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import employeeService from '../services/employeeService';

export const {
    useList: useEmployees,
    useShow: useEmployee,
    useCreate: useCreateEmployee,
    useUpdate: useUpdateEmployee,
    useRemove: useDeleteEmployee,
} = createResourceHooks('employees', employeeService);
