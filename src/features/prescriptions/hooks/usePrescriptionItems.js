import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import prescriptionItemService from '../services/prescriptionItemService';

export const {
  useList: usePrescriptionItems,
  useShow: usePrescriptionItem,
  useCreate: useCreatePrescriptionItem,
  useUpdate: useUpdatePrescriptionItem,
  useRemove: useDeletePrescriptionItem,
} = createResourceHooks('prescription-items', prescriptionItemService);
