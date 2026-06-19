import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import dispensingService from '../services/dispensingService';

export const {
  useList: useDispensings,
  useShow: useDispensing,
  useCreate: useCreateDispensing,
  useUpdate: useUpdateDispensing,
  useRemove: useDeleteDispensing,
} = createResourceHooks('dispensings', dispensingService);
