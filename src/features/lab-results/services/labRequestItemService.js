import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const labRequestItemService = createResourceService(ENDPOINTS.labRequestItems);
export default labRequestItemService;
