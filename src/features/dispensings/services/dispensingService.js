import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const dispensingService = createResourceService(ENDPOINTS.dispensings);
export default dispensingService;
