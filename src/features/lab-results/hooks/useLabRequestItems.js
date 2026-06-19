import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import labRequestItemService from '../services/labRequestItemService';

export const {
  useList: useLabRequestItems,
  useShow: useLabRequestItem,
  useCreate: useCreateLabRequestItem,
  useUpdate: useUpdateLabRequestItem,
  useRemove: useDeleteLabRequestItem,
} = createResourceHooks('lab-request-items', labRequestItemService);
