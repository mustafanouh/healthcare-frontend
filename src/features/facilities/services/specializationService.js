import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const specializationService = createResourceService(ENDPOINTS.specializations);
export default specializationService;