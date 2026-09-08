import { useQuery } from '@tanstack/react-query';
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

// جديد
export const usePatientMedicalConditionsSummary = (patientId, options = {}) =>
    useQuery({
        queryKey: ['patient-medical-conditions', 'summary', patientId],
        queryFn: () => patientMedicalConditionService.getSummaryByPatient(patientId),
        enabled: Boolean(patientId),
        select: (response) => response?.data ?? response,
        ...options,
    });

export const useCreatePatientMedicalCondition = useCreate;
export const useUpdatePatientMedicalCondition = useUpdate;
export const useDeletePatientMedicalCondition = useRemove;