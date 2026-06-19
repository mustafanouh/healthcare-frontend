import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import patientService from '../services/patientService';

export const {
  useList: usePatients,
  useShow: usePatient,
  useCreate: useCreatePatient,
  useUpdate: useUpdatePatient,
  useRemove: useDeletePatient,
} = createResourceHooks('patients', patientService);
