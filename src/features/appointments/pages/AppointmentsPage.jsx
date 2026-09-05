import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge, Button, Card, Input, Modal, Select, Spinner } from '../../../shared/components/ui';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useAvailableSlots,
  useChangeAppointmentStatus,
  useStartVisitFromAppointment,
} from '../hooks/useAppointments';
import { useDoctors } from '../../doctor/hooks/useDoctors';
import { usePatients } from '../../patient/hooks/usePatients';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate, formatTime } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';

const PatientBookingModal = ({ open, onClose, doctors, patientId, onSubmit, isSubmitting }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [doctorId, setDoctorId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { data: slotsResponse, isLoading: slotsLoading, isError: slotsError } = useAvailableSlots({
    doctor_id: doctorId,
    date: scheduledDate,
  });
  const slots = Array.isArray(slotsResponse?.data) ? slotsResponse.data : [];

  useEffect(() => {
    setStartTime('');
  }, [doctorId, scheduledDate]);

  useEffect(() => {
    if (startTime && !slots.includes(startTime)) setStartTime('');
  }, [slots, startTime]);

  const reset = () => {
    setDoctorId('');
    setScheduledDate('');
    setStartTime('');
    setReason('');
  };

  const handleClose = () => {
    reset();
    setSubmitError('');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    try {
      await onSubmit({
        patient_id: patientId,
        doctor_id: Number(doctorId),
        status: 'pending',
        reason: reason.trim(),
        scheduled_date: scheduledDate,
        start_time: startTime.slice(0, 5),
      });
    } catch (error) {
      setSubmitError(parseApiError(error, t('common.saveError', { defaultValue: 'Could not save the appointment.' })));
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={t('appointments.newAppointment')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {submitError}
          </div>
        )}
        <Select
          label={t('appointments.doctor')}
          name="doctor_id"
          value={doctorId}
          onChange={(event) => setDoctorId(event.target.value)}
          options={doctors}
          placeholder={t('appointments.selectDoctor', { defaultValue: 'Select a doctor' })}
          required
        />

        <Input
          label={t('appointments.scheduledDate')}
          name="scheduled_date"
          type="date"
          value={scheduledDate}
          onChange={(event) => setScheduledDate(event.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label={t('appointments.reason', { defaultValue: 'Reason for visit' })}
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('appointments.reasonPlaceholder', { defaultValue: 'Describe the reason for your appointment' })}
          required
        />

        <div>
          <Select
            label={t('appointments.startTime')}
            name="start_time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            options={slots.map((slot) => ({ value: slot, label: formatTime(slot) }))}
            placeholder={
              slotsLoading
                ? t('appointments.loadingSlots', { defaultValue: 'Loading available times...' })
                : t('appointments.selectTime', { defaultValue: 'Select an available time' })
            }
            disabled={!doctorId || !scheduledDate || slotsLoading || slots.length === 0}
            required
          />
          {slotsError && (
            <p className="mt-1.5 text-xs text-red-500">
              {t('appointments.slotsError', { defaultValue: 'Could not load available times.' })}
            </p>
          )}
          {!slotsLoading && doctorId && scheduledDate && !slotsError && slots.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-600">
              {t('appointments.noSlots', { defaultValue: 'No available times for this date.' })}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!patientId || !startTime || !reason.trim()}>
            {t('common.save', { defaultValue: 'Book appointment' })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const AppointmentsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const isPatientPage = window.location.pathname === '/patient/appointments';

  const createMut = useCreateAppointment();
  const updateMut = useUpdateAppointment();
  const deleteMut = useDeleteAppointment();
  const statusMut = useChangeAppointmentStatus();
  const startVisitMut = useStartVisitFromAppointment();

  const { data: doctorsData } = useDoctors();
  const { data: patientsData } = usePatients();
  const [bookingOpen, setBookingOpen] = useState(false);

  const doctors = (doctorsData?.data ?? []).map((d) => ({ value: d.id, label: d.employee?.profile?.full_name ?? `Dr #${d.id}` }));
  const patients = (patientsData?.data ?? []).map((p) => ({ value: p.id, label: p.profile?.full_name ?? `#${p.id}` }));
  const patientRecord = (patientsData?.data ?? []).find((patient) => String(patient.profile?.user_id) === String(user?.id));
  const patientId = user?.patient?.id ?? user?.patient_id ?? patientRecord?.id ?? user?.id;
  const { data, isLoading } = useAppointments(isPatientPage ? { patient_id: patientId } : {});

  if (isPatientPage) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('appointments.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('appointments.subtitle', { defaultValue: 'View and book your appointments' })}</p>
          </div>
          <Button onClick={() => setBookingOpen(true)} disabled={!patientId}>
            {t('appointments.newAppointment')}
          </Button>
        </div>
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-surface-800">
              <thead className="bg-gray-50 dark:bg-surface-800/50">
                <tr>
                  {[t('appointments.doctor'), t('appointments.scheduledDate'), t('appointments.startTime'), t('common.status', { ns: 'common' })].map((heading) => (
                    <th key={heading} className="px-6 py-3 text-start text-xs font-semibold uppercase text-gray-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                {(data?.data ?? []).map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{appointment.doctor?.employee?.profile?.full_name
                      ?? appointment.doctor?.profile?.full_name
                      ?? `#${appointment.doctor_id}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{formatDate(appointment.scheduled_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{formatTime(appointment.start_time)}</td>
                    <td className="px-6 py-4"><Badge status={appointment.status} /></td>
                  </tr>
                ))}
                {!isLoading && !(data?.data ?? []).length && (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">{t('common.noData', { defaultValue: 'No appointments found.' })}</td></tr>
                )}
                {isLoading && <tr><td colSpan="4" className="px-6 py-10 text-center"><Spinner /></td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
        <PatientBookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          doctors={doctors}
          patientId={patientId}
          onSubmit={(values) => createMut.mutateAsync(values).then(() => setBookingOpen(false))}
          isSubmitting={createMut.isPending}
        />
      </div>
    );
  }

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    { key: 'patient', label: t('appointments.patient'), render: (r) => r.patient?.profile?.full_name ?? `#${r.patient_id}` },
    {
      key: 'doctor', label: t('appointments.doctor'), render: (r) => r.doctor?.employee?.profile?.full_name
        ?? r.doctor?.profile?.full_name
        ?? `#${r.doctor_id}`
    },
    { key: 'scheduled_date', label: t('appointments.scheduledDate'), render: (r) => formatDate(r.scheduled_date) },
    { key: 'time', label: t('appointments.startTime'), render: (r) => `${formatTime(r.start_time)} ` },
    { key: 'status', label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    {
      key: 'actions',
      label: t('common.actions', { ns: 'common' }),
      render: (r) => (
        r.status === 'confirmed' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => startVisitMut.mutate(r.id)}
            loading={startVisitMut.isPending}
          >
            {t('appointments.startVisit', { defaultValue: 'Start Visit' })}
          </Button>
        )
      ),
    },
  ];

  const fields = [
    { name: 'patient_id', label: t('appointments.patient'), type: 'select', options: patients },
    { name: 'doctor_id', label: t('appointments.doctor'), type: 'select', options: doctors },
    { name: 'scheduled_date', label: t('appointments.scheduledDate'), type: 'date' },
    { name: 'start_time', label: t('appointments.startTime'), type: 'time', dir: 'ltr' },
    { name: 'end_time', label: t('appointments.endTime'), type: 'time', dir: 'ltr' },
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
