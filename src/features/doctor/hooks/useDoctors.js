import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import doctorService from '../services/doctorService';

export const {
  useList: useDoctors,
  useShow: useDoctor,
  useCreate: useCreateDoctor,
  useUpdate: useUpdateDoctor,
  useRemove: useDeleteDoctor,
} = createResourceHooks('doctors', doctorService);
