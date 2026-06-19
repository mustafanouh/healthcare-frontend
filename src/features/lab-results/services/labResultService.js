import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const labResultService = createResourceService(ENDPOINTS.labResults);
export default labResultService;
