import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useLabStaffList, useCreateLabStaff, useUpdateLabStaff, useDeleteLabStaff } from '../hooks/useLabStaff';
import { useFacilities } from '../../facilities/hooks/useFacilities';

const LabStaffPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabStaffList();
  const { data: facilData } = useFacilities();
  const createMut = useCreateLabStaff();
  const updateMut = useUpdateLabStaff();
  const deleteMut = useDeleteLabStaff();

  const facilities = (facilData?.data ?? []).map((f) => ({ value: f.id, label: f.name }));

  const columns = [
    { key: 'id',             label: t('common.id',   { ns: 'common' }) },
    { key: 'name',           label: t('common.name', { ns: 'common' }), render: (r) => r.profile?.full_name ?? '—' },
    { key: 'specialization', label: t('nav.specializations', { ns: 'common' }) },
    { key: 'facility',       label: t('nav.facilities', { ns: 'common' }), render: (r) => r.facility?.name ?? '—' },
  ];

  const fields = [
    { name: 'facility_id',    label: t('nav.facilities', { ns: 'common' }), type: 'select', options: facilities },
    { name: 'specialization', label: t('nav.specializations', { ns: 'common' }) },
  ];

  return (
    <CrudPage
      title={t('nav.labStaff', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ facility_id: '', specialization: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabStaffPage;
