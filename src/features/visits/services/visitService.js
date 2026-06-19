import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const visitService = createResourceService(ENDPOINTS.visits);
export default visitService;
