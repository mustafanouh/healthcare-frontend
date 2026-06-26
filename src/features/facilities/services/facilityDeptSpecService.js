import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const facilityDeptSpecService = createResourceService(ENDPOINTS.facilityDeptSpecs);
export default facilityDeptSpecService;
