import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility } from '../hooks/useFacilities';

const FacilitiesPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useFacilities();
  const createMut = useCreateFacility();
  const updateMut = useUpdateFacility();
  const deleteMut = useDeleteFacility();

  const columns = [
    { key: 'id',            label: t('common.id',   { ns: 'common' }) },
    { key: 'name',          label: t('common.name', { ns: 'common' }) },
    { key: 'facility_type', label: t('facilities.facilityType') },
    { key: 'phone',         label: t('common.phone',   { ns: 'common' }) },
    { key: 'address',       label: t('common.address', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'name',          label: t('common.name', { ns: 'common' }) },
    {
      name: 'facility_type',
      label: t('facilities.facilityType'),
      type: 'select',
      options: ['hospital', 'clinic', 'lab', 'pharmacy'].map((v) => ({ value: v, label: v })),
    },
    { name: 'phone',   label: t('common.phone',   { ns: 'common' }), dir: 'ltr' },
    { name: 'address', label: t('common.address', { ns: 'common' }), fullWidth: true },
  ];

  return (
    <CrudPage
      title={t('facilities.title')}
      addLabel={t('facilities.newFacility')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ name: '', facility_type: 'clinic', phone: '', address: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default FacilitiesPage;
