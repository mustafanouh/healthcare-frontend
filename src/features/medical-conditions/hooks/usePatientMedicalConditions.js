import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import patientMedicalConditionService from '../services/patientMedicalConditionService';

export const {
  useList: usePatientMedicalConditions,
  useShow: usePatientMedicalCondition,
  useCreate: useCreatePatientMedicalCondition,
  useUpdate: useUpdatePatientMedicalCondition,
  useRemove: useDeletePatientMedicalCondition,
} = createResourceHooks('patient-medical-conditions', patientMedicalConditionService);
