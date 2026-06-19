import { createResourceHooks } from '../../../core/hooks/useResourceQueries';
import specializationService from '../services/specializationService';

export const {
  useList: useSpecializations,
  useShow: useSpecialization,
  useCreate: useCreateSpecialization,
  useUpdate: useUpdateSpecialization,
  useRemove: useDeleteSpecialization,
} = createResourceHooks('specializations', specializationService);
