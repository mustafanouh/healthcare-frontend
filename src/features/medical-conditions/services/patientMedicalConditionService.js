import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const patientMedicalConditionService = createResourceService(ENDPOINTS.patientMedicalConditions);
export default patientMedicalConditionService;
