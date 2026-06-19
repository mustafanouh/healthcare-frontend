import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import labStaffService from '../services/labStaffService';

export const {
  useList: useLabStaffList,
  useShow: useLabStaffMember,
  useCreate: useCreateLabStaff,
  useUpdate: useUpdateLabStaff,
  useRemove: useDeleteLabStaff,
} = createResourceHooks('labstaff', labStaffService);
