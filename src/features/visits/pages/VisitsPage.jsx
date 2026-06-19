import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useVisits, useCreateVisit, useUpdateVisit, useDeleteVisit } from '../hooks/useVisits';
import { formatDate } from '../../../shared/utils/formatters';

const VisitsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useVisits();
  const createMut = useCreateVisit();
  const updateMut = useUpdateVisit();
  const deleteMut = useDeleteVisit();

  const columns = [
    { key: 'id',         label: t('common.id',   { ns: 'common' }) },
    { key: 'patient',    label: t('appointments.patient'), render: (r) => r.patient?.profile?.full_name ?? `#${r.patient_id}` },
    { key: 'doctor',     label: t('appointments.doctor'),  render: (r) => r.doctor?.profile?.full_name  ?? `#${r.doctor_id}` },
    { key: 'visited_at', label: t('visits.visitedAt'), render: (r) => formatDate(r.visited_at) },
    { key: 'notes',      label: t('common.notes', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'appointment_id', label: 'Appointment ID', type: 'text', dir: 'ltr' },
    { name: 'notes',          label: t('common.notes', { ns: 'common' }), type: 'textarea', fullWidth: true },
    { name: 'visited_at',     label: t('visits.visitedAt'), type: 'datetime-local', dir: 'ltr' },
  ];

  return (
    <CrudPage
      title={t('visits.title')}
      addLabel={t('visits.newVisit')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ appointment_id: '', notes: '', visited_at: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default VisitsPage;
