import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import labTestService from '../services/labTestService';

export const {
  useList: useLabTests,
  useShow: useLabTest,
  useCreate: useCreateLabTest,
  useUpdate: useUpdateLabTest,
  useRemove: useDeleteLabTest,
} = createResourceHooks('lab-tests', labTestService);
