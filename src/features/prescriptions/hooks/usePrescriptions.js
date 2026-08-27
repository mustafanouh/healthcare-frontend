import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import { useQuery } from '@tanstack/react-query';
import prescriptionService from '../services/prescriptionService';

export const {
  useList: usePrescriptions,
  useShow: usePrescription,
  useCreate: useCreatePrescription,
  useUpdate: useUpdatePrescription,
  useRemove: useDeletePrescription,
} = createResourceHooks('prescriptions', prescriptionService);

export const usePrescriptionItems = (prescriptionId, options = {}) => useQuery({
  queryKey: ['prescriptions', 'items', prescriptionId],
  queryFn: () => prescriptionService.items(prescriptionId),
  enabled: Boolean(prescriptionId),
  ...options,
});
