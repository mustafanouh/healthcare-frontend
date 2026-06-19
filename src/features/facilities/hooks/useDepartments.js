import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import departmentService from '../services/departmentService';

export const {
  useList: useDepartments,
  useShow: useDepartment,
  useCreate: useCreateDepartment,
  useUpdate: useUpdateDepartment,
  useRemove: useDeleteDepartment,
} = createResourceHooks('departments', departmentService);
