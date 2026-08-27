import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import patientMedicalConditionService from '../services/patientMedicalConditionService';

const {
    useList,
    useCreate,
    useUpdate,
    useRemove,
} = createResourceHooks('patient-medical-conditions', patientMedicalConditionService);

export const usePatientMedicalConditions = (patientId, options = {}) =>
    useList({ patient_id: patientId }, { enabled: Boolean(patientId), ...options });

export const useCreatePatientMedicalCondition = useCreate;
export const useUpdatePatientMedicalCondition = useUpdate;
export const useDeletePatientMedicalCondition = useRemove;
