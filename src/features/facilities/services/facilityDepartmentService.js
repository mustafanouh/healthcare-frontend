import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const facilityDepartmentService = createResourceService(ENDPOINTS.facilityDepartments);
export default facilityDepartmentService;
