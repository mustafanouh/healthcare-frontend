import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import doctorScheduleService from '../services/doctorScheduleService';

export const {
  useList: useDoctorSchedules,
  useShow: useDoctorScheduleItem,
  useCreate: useCreateDoctorSchedule,
  useUpdate: useUpdateDoctorSchedule,
  useRemove: useDeleteDoctorSchedule,
} = createResourceHooks('doctor-schedule', doctorScheduleService);
