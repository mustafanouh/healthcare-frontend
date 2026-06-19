import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from '../hooks/useDoctors';
import { useFacilities } from '../../facilities/hooks/useFacilities';
import { useSpecializations } from '../../facilities/hooks/useSpecializations';

const DoctorsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading }   = useDoctors();
  const { data: facilData }   = useFacilities();
  const { data: specData }    = useSpecializations();
  const createMut = useCreateDoctor();
  const updateMut = useUpdateDoctor();
  const deleteMut = useDeleteDoctor();

  const facilities = (facilData?.data ?? []).map((f) => ({ value: f.id, label: f.name }));
  const specs      = (specData?.data  ?? []).map((s) => ({ value: s.id, label: s.name }));

  const columns = [
    { key: 'id',             label: t('common.id',   { ns: 'common' }) },
    { key: 'name',           label: t('common.name', { ns: 'common' }), render: (r) => r.profile?.full_name ?? '—' },
    { key: 'specialization', label: t('nav.specializations', { ns: 'common' }), render: (r) => r.specialization?.name ?? '—' },
    { key: 'facility',       label: t('nav.facilities', { ns: 'common' }), render: (r) => r.facility?.name ?? '—' },
    { key: 'phone',          label: t('common.phone', { ns: 'common' }), render: (r) => r.profile?.phone ?? '—' },
  ];

  const fields = [
    { name: 'facility_id',       label: t('nav.facilities', { ns: 'common' }),       type: 'select', options: facilities },
    { name: 'specialization_id', label: t('nav.specializations', { ns: 'common' }), type: 'select', options: specs },
  ];

  return (
    <CrudPage
      title={t('nav.doctors', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ facility_id: '', specialization_id: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DoctorsPage;
