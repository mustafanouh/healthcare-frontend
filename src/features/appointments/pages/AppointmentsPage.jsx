import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useChangeAppointmentStatus,
} from '../hooks/useAppointments';
import { useDoctors } from '../../doctor/hooks/useDoctors';
import { usePatients } from '../../patient/hooks/usePatients';
import { formatDate, formatTime } from '../../../shared/utils/formatters';

const AppointmentsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);

  const { data, isLoading } = useAppointments();
  const createMut = useCreateAppointment();
  const updateMut = useUpdateAppointment();
  const deleteMut = useDeleteAppointment();
  const statusMut = useChangeAppointmentStatus();

  const { data: doctorsData }  = useDoctors();
  const { data: patientsData } = usePatients();

  const doctors  = (doctorsData?.data  ?? []).map((d) => ({ value: d.id, label: d.profile?.full_name ?? `Dr #${d.id}` }));
  const patients = (patientsData?.data ?? []).map((p) => ({ value: p.id, label: p.profile?.full_name ?? `#${p.id}` }));

  const columns = [
    { key: 'id',             label: t('common.id', { ns: 'common' }) },
    { key: 'patient',        label: t('appointments.patient'), render: (r) => r.patient?.profile?.full_name ?? `#${r.patient_id}` },
    { key: 'doctor',         label: t('appointments.doctor'),  render: (r) => r.doctor?.profile?.full_name  ?? `#${r.doctor_id}` },
    { key: 'scheduled_date', label: t('appointments.scheduledDate'), render: (r) => formatDate(r.scheduled_date) },
    { key: 'time',           label: t('appointments.startTime'), render: (r) => `${formatTime(r.start_time)} – ${formatTime(r.end_time)}` },
    { key: 'status',         label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
  ];

  const fields = [
    { name: 'patient_id', label: t('appointments.patient'), type: 'select', options: patients },
    { name: 'doctor_id',  label: t('appointments.doctor'),  type: 'select', options: doctors  },
    { name: 'scheduled_date', label: t('appointments.scheduledDate'), type: 'date' },
    { name: 'start_time',     label: t('appointments.startTime'),     type: 'time', dir: 'ltr' },
    { name: 'end_time',       label: t('appointments.endTime'),       type: 'time', dir: 'ltr' },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: ['pending', 'confirmed', 'completed', 'cancelled'].map((s) => ({
        value: s,
        label: t(`status.${s}`, { ns: 'common' }),
      })),
    },
  ];

  return (
    <CrudPage
      title={t('appointments.title')}
      addLabel={t('appointments.newAppointment')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ patient_id: '', doctor_id: '', scheduled_date: '', start_time: '', end_time: '', status: 'pending' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default AppointmentsPage;
