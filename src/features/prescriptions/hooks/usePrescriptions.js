import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import prescriptionService from '../services/prescriptionService';

export const {
  useList: usePrescriptions,
  useShow: usePrescription,
  useCreate: useCreatePrescription,
  useUpdate: useUpdatePrescription,
  useRemove: useDeletePrescription,
} = createResourceHooks('prescriptions', prescriptionService);
