import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import medicalConditionService from '../services/medicalConditionService';

export const {
  useList: useMedicalConditions,
  useShow: useMedicalCondition,
  useCreate: useCreateMedicalCondition,
  useUpdate: useUpdateMedicalCondition,
  useRemove: useDeleteMedicalCondition,
} = createResourceHooks('medical-conditions', medicalConditionService);
