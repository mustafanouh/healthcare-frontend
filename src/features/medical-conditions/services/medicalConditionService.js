import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const medicalConditionService = createResourceService(ENDPOINTS.medicalConditions);
export default medicalConditionService;
