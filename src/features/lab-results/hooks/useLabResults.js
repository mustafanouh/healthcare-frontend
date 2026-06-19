import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import labResultService from '../services/labResultService';

export const {
  useList: useLabResults,
  useShow: useLabResult,
  useCreate: useCreateLabResult,
  useUpdate: useUpdateLabResult,
  useRemove: useDeleteLabResult,
} = createResourceHooks('lab-results', labResultService);
