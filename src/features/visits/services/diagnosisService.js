import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const diagnosisService = createResourceService(ENDPOINTS.diagnoses);
export default diagnosisService;
