import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import roleService from '../services/roleService';

export const useUsersWithRoles = (params = {}) => useQuery({
  queryKey: ['admin', 'roles', 'users', params],
  queryFn: () => roleService.listUsers(params),
});

export const useAvailableRoles = () => useQuery({
  queryKey: ['admin', 'roles', 'available'],
  queryFn: roleService.listRoles,
  staleTime: 5 * 60 * 1000,
});

export const useSyncUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roles }) => roleService.syncUserRoles(userId, roles),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }),
  });
};
