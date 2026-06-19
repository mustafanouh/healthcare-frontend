import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Generic React Query hook factory built on top of createResourceService.
 *
 * Usage:
 *   const { useList, useShow, useCreate, useUpdate, useRemove } =
 *     createResourceHooks('appointments', appointmentService);
 *
 *   const { data, isLoading } = useList();
 *   const createMutation = useCreate();
 *   createMutation.mutate({ patient_id: 1, ... });
 *
 * `queryKey` namespaces the cache per resource so create/update/delete
 * mutations can invalidate exactly the right list/detail queries.
 */
export const createResourceHooks = (queryKey, service) => {
  const useList = (params = {}, options = {}) =>
    useQuery({
      queryKey: [queryKey, 'list', params],
      queryFn: () => service.list(params),
      ...options,
    });

  const useShow = (id, options = {}) =>
    useQuery({
      queryKey: [queryKey, 'detail', id],
      queryFn: () => service.show(id),
      enabled: Boolean(id),
      ...options,
    });

  const useCreate = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: service.create,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
        options.onSuccess?.(...args);
      },
      ...options,
    });
  };

  const useUpdate = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }) => service.update(id, payload),
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
        queryClient.invalidateQueries({ queryKey: [queryKey, 'detail'] });
        options.onSuccess?.(...args);
      },
      ...options,
    });
  };

  const useRemove = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: service.remove,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] });
        options.onSuccess?.(...args);
      },
      ...options,
    });
  };

  return { useList, useShow, useCreate, useUpdate, useRemove };
};

export default createResourceHooks;
