import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';

const PatientsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = usePatients();
  const createMut = useCreatePatient();
  const updateMut = useUpdatePatient();
  const deleteMut = useDeletePatient();

  const columns = [
    { key: 'id',         label: t('common.id',   { ns: 'common' }) },
    { key: 'name',       label: t('common.name', { ns: 'common' }), render: (r) => r.profile?.full_name ?? '—' },
    { key: 'blood_type', label: 'Blood Type' },
    { key: 'phone',      label: t('common.phone',   { ns: 'common' }), render: (r) => r.profile?.phone ?? '—' },
    { key: 'address',    label: t('common.address', { ns: 'common' }), render: (r) => r.profile?.address ?? '—' },
  ];

  const fields = [
    { name: 'blood_type', label: 'Blood Type', type: 'select', options: ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((v) => ({ value: v, label: v })) },
  ];

  return (
    <CrudPage
      title={t('nav.patients', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ blood_type: 'A+' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PatientsPage;
