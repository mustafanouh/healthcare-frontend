import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useVisits, useCreateVisit, useUpdateVisit, useDeleteVisit } from '../hooks/useVisits';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { formatDate, formatTime } from '../../../shared/utils/formatters';

const VisitsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useVisits();
  const { data: appointmentsData } = useAppointments();
  const createMut = useCreateVisit();
  const updateMut = useUpdateVisit();
  const deleteMut = useDeleteVisit();

  const listData = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const appointments = Array.isArray(appointmentsData?.data)
    ? appointmentsData.data
    : Array.isArray(appointmentsData)
      ? appointmentsData
      : [];

  const appointmentOptions = appointments.map((appointment) => ({
    value: String(appointment.id),
    label: `${appointment.doctor?.profile?.full_name ?? `Dr #${appointment.doctor_id}`} — ${appointment.patient?.profile?.full_name ?? `Patient #${appointment.patient_id}`} — ${formatTime(appointment.start_time)}`,
  }));

  const normalizePayload = (values) => ({
    ...values,
    appointment_id: Number(values.appointment_id),
  });

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    { key: 'patient', label: t('appointments.patient'), render: (r) => r.patient?.profile?.full_name ?? `#${r.patient_id}` },
    { key: 'doctor', label: t('appointments.doctor'), render: (r) => r.doctor?.profile?.full_name ?? `#${r.doctor_id}` },
    { key: 'visited_at', label: t('visits.visitedAt'), render: (r) => formatDate(r.visited_at) },
    { key: 'notes', label: t('common.notes', { ns: 'common' }) },
  ];

  const fields = [
    {
      name: 'appointment_id',
      label: t('appointments.title'),
      type: 'select',
      options: appointmentOptions,
      placeholder: t('appointments.selectAppointment', { defaultValue: 'Select appointment' }),
      fullWidth: true,
    },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), type: 'textarea', fullWidth: true },
    { name: 'visited_at', label: t('visits.visitedAt'), type: 'datetime-local', dir: 'ltr' },
  ];

  return (
    <CrudPage
      title={t('visits.title')}
      addLabel={t('visits.newVisit')}
      columns={columns}
      data={listData}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ appointment_id: searchParams.get('appointment_id') ?? '', notes: '', visited_at: '' }}
      onCreate={(v) => createMut.mutateAsync(normalizePayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: normalizePayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default VisitsPage;







