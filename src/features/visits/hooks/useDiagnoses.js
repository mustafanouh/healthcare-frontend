import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import diagnosisService from '../services/diagnosisService';

export const {
  useList: useDiagnoses,
  useShow: useDiagnosis,
  useCreate: useCreateDiagnosis,
  useUpdate: useUpdateDiagnosis,
  useRemove: useDeleteDiagnosis,
} = createResourceHooks('diagnoses', diagnosisService);
