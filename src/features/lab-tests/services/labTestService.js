import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const labTestService = createResourceService(ENDPOINTS.labTests);
export default labTestService;
