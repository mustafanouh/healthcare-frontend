import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const departmentService = createResourceService(ENDPOINTS.departments);
export default departmentService;
