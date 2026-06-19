import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import appointmentService from '../services/appointmentService';

export const {
  useList: useAppointments,
  useShow: useAppointment,
  useCreate: useCreateAppointment,
  useUpdate: useUpdateAppointment,
  useRemove: useDeleteAppointment,
} = createResourceHooks('appointments', appointmentService);

/**
 * GET /available-slots — find open slots for a doctor on a given date.
 *   const { data } = useAvailableSlots({ doctor_id, date });
 */
export const useAvailableSlots = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['appointments', 'available-slots', params],
    queryFn: () => appointmentService.availableSlots(params),
    enabled: Boolean(params.doctor_id && params.date),
    ...options,
  });

/**
 * PATCH /appointments/{id}/status
 *   changeStatus.mutate({ id, status: 'confirmed' })
 */
export const useChangeAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => appointmentService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'list'] });
    },
  });
};
