import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import labRequestItemService from '../services/labRequestItemService';

export const {
  useList: useLabRequestItems,
  useShow: useLabRequestItem,
  useCreate: useCreateLabRequestItem,
  useUpdate: useUpdateLabRequestItem,
  useRemove: useDeleteLabRequestItem,
} = createResourceHooks('lab-request-items', labRequestItemService);

export const useStartLabRequestItem = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => labRequestItemService.start(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['lab-request-items', 'list'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
