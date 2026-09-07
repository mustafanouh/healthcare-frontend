import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import employeeService from '../services/employeeService';

export const {
    useList: useEmployees,
    useShow: useEmployee,
    useCreate: useCreateEmployee,
    useUpdate: useUpdateEmployee,
    useRemove: useDeleteEmployee,
} = createResourceHooks('employees', employeeService);

export const useSoftDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: employeeService.softDelete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['employees', 'detail'] });
        },
    });
};

export const useActivateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: employeeService.activate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['employees', 'detail'] });
        },
    });
};
