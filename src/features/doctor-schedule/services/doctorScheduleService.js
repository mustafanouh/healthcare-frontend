import { ENDPOINTS } from '../../../core/api/endpoints';
import { createResourceService } from '../../../core/api/createResourceService';

export const doctorScheduleService = createResourceService(ENDPOINTS.doctorSchedule);
export default doctorScheduleService;
