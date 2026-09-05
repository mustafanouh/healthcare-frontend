import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import visitService from '../services/visitService';

export const {
  useList: useVisits,
  useShow: useVisit,
  useCreate: useCreateVisit,
  useUpdate: useUpdateVisit,
  useRemove: useDeleteVisit,
} = createResourceHooks('visits', visitService);

/**
 * PATCH /visits/{id}/complete
 *   completeVisit.mutate(visitId)
 *   Changes visit status to 'completed'
 */
export const useCompleteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => visitService.completeVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['visits', 'detail'] });
    },
  });
};

/**
 * PATCH /visits/{id}/status
 *   changeStatus.mutate({ id, status: 'cancelled' })
 *   Changes visit status (completed, cancelled)
 */
export const useChangeVisitStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => visitService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['visits', 'detail'] });
    },
  });
};
