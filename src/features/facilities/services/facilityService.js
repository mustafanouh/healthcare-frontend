import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const facilityService = createResourceService(ENDPOINTS.facilities);
export default facilityService;
