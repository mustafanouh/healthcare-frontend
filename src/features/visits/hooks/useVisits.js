import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import visitService from '../services/visitService';

export const {
  useList: useVisits,
  useShow: useVisit,
  useCreate: useCreateVisit,
  useUpdate: useUpdateVisit,
  useRemove: useDeleteVisit,
} = createResourceHooks('visits', visitService);
