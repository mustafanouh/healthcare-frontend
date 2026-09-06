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
import { usePatients } from '../../patient/hooks/usePatients';
import { useFacilities, useFacilityBookingDepartments, useFacilityBookingSpecializations, useFacilityBookingDoctors } from '../../facilities/hooks/useFacilities';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate, formatTime } from '../../../shared/utils/formatters';
import { parseApiError } from '../../../shared/utils/parseApiError';

const PatientBookingModal = ({ open, onClose, patients = [], patientsLoading = false, patientsError = '', patientId, onSubmit, isSubmitting }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [selectedPatientId, setSelectedPatientId] = useState(patientId ? String(patientId) : '');
  const [facilityId, setFacilityId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { data: facilitiesData, isLoading: facilitiesLoading } = useFacilities();
  const { data: departmentsData, isLoading: departmentsLoading } = useFacilityBookingDepartments(facilityId);
  const { data: specializationsData, isLoading: specializationsLoading } = useFacilityBookingSpecializations(facilityId, departmentId);
  const { data: doctorsData, isLoading: doctorsLoading } = useFacilityBookingDoctors(facilityId, departmentId, specializationId);

  const listFromResponse = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  const facilities = listFromResponse(facilitiesData).filter((facility) => facility.facility_type === 'hospital' && Boolean(facility.is_active));
  const departments = listFromResponse(departmentsData).filter((department) => Boolean(department.is_active));
  const specializations = listFromResponse(specializationsData).filter((specialization) => Boolean(specialization.is_active));
  const doctors = listFromResponse(doctorsData).filter((doctor) => Boolean(doctor.employee?.is_active));
  const facilityOptions = facilities.map((facility) => ({ value: String(facility.id), label: facility.name }));
  const departmentOptions = departments.map((department) => ({ value: String(department.id), label: department.name }));
  const specializationOptions = specializations.map((specialization) => ({ value: String(specialization.id), label: specialization.name }));
  const doctorOptions = doctors.map((doctor) => ({ value: String(doctor.id), label: doctor.employee?.profile?.full_name ?? `Dr #${doctor.id}` }));

  useEffect(() => {
    if (patientId) setSelectedPatientId(String(patientId));
  }, [patientId]);

  const { data: slotsResponse, isLoading: slotsLoading, isError: slotsError } = useAvailableSlots({
    doctor_id: doctorId,
    date: scheduledDate,
  });
  const slots = Array.isArray(slotsResponse?.data) ? slotsResponse.data : [];

  useEffect(() => {
    setDepartmentId('');
    setSpecializationId('');
    setDoctorId('');
    setScheduledDate('');
    setStartTime('');
  }, [facilityId]);

  useEffect(() => {
    setSpecializationId('');
    setDoctorId('');
    setScheduledDate('');
    setStartTime('');
  }, [departmentId]);

  useEffect(() => {
    setDoctorId('');
    setScheduledDate('');
    setStartTime('');
  }, [specializationId]);

  useEffect(() => {
    setStartTime('');
  }, [doctorId, scheduledDate]);

  useEffect(() => {
    if (startTime && !slots.includes(startTime)) setStartTime('');
  }, [slots, startTime]);

  const reset = () => {
    setSelectedPatientId(patientId ? String(patientId) : '');
    setFacilityId('');
    setDepartmentId('');
    setSpecializationId('');
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
        patient_id: Number(selectedPatientId),
        doctor_id: Number(doctorId),
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
        {!patientId && <Select label={t('appointments.patient')} name="patient_id" value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)} options={patients} placeholder={patientsLoading ? t('appointments.loadingPatients', { defaultValue: 'Loading patients...' }) : patientsError || t('appointments.selectPatient', { defaultValue: 'Select a patient' })} disabled={patientsLoading || Boolean(patientsError)} required />}

        <Select label={t('appointments.facility', { defaultValue: 'Facility' })} name="facility_id" value={facilityId} onChange={(event) => setFacilityId(event.target.value)} options={facilityOptions} placeholder={facilitiesLoading ? t('appointments.loadingFacilities', { defaultValue: 'Loading facilities...' }) : t('appointments.selectFacility', { defaultValue: 'Select a hospital' })} disabled={facilitiesLoading} required />
        <Select label={t('appointments.department', { defaultValue: 'Department' })} name="department_id" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} options={departmentOptions} placeholder={departmentsLoading ? t('appointments.loadingDepartments', { defaultValue: 'Loading departments...' }) : t('appointments.selectDepartment', { defaultValue: 'Select a department' })} disabled={!facilityId || departmentsLoading} required />
        <Select label={t('appointments.specialization', { defaultValue: 'Specialization' })} name="specialization_id" value={specializationId} onChange={(event) => setSpecializationId(event.target.value)} options={specializationOptions} placeholder={specializationsLoading ? t('appointments.loadingSpecializations', { defaultValue: 'Loading specializations...' }) : t('appointments.selectSpecialization', { defaultValue: 'Select a specialization' })} disabled={!departmentId || specializationsLoading} required />
        <Select label={t('appointments.doctor')} name="doctor_id" value={doctorId} onChange={(event) => setDoctorId(event.target.value)} options={doctorOptions} placeholder={doctorsLoading ? t('appointments.loadingDoctors', { defaultValue: 'Loading doctors...' }) : t('appointments.selectDoctor', { defaultValue: 'Select a doctor' })} disabled={!specializationId || doctorsLoading} required />

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
            {t('actions.cancel', { ns: 'common' })}
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!selectedPatientId || !doctorId || !startTime || !reason.trim()}>
            {t('appointments.bookAppointment')}
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

  const {
    data: patientsData,
    isLoading: patientsLoading,
    isError: patientsError,
    error: patientsQueryError,
  } = usePatients();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [startVisitError, setStartVisitError] = useState('');
  const [startVisitAppointment, setStartVisitAppointment] = useState(null);

  const patientList = Array.isArray(patientsData?.data)
    ? patientsData.data
    : Array.isArray(patientsData?.data?.data)
      ? patientsData.data.data
      : Array.isArray(patientsData)
        ? patientsData
        : [];
  const patients = patientList.map((patient) => ({
    value: patient.id,
    label: patient.profile?.full_name ?? patient.full_name ?? patient.name ?? `#${patient.id}`,
  }));
  const patientsErrorMessage = patientsQueryError
    ? parseApiError(
      patientsQueryError,
      patientsQueryError.response?.status
        ? `Could not load patients (HTTP ${patientsQueryError.response.status}).`
        : 'Could not load patients. Check the API connection.'
    )
    : '';
  const patientRecord = patientList.find((patient) => String(patient.profile?.user_id ?? patient.user_id) === String(user?.id));
  const patientId = user?.patient?.id ?? user?.patient_id ?? patientRecord?.id ?? user?.id;
  const { data, isLoading } = useAppointments(isPatientPage ? { patient_id: patientId } : {});

  const handleStartVisit = async (appointment) => {
    setStartVisitAppointment(appointment);
    setStartVisitError('');

    try {
      await startVisitMut.mutateAsync(appointment.id);
    } catch (error) {
      setStartVisitError(
        parseApiError(error, t('common.requestError', { defaultValue: 'Could not start the visit.' }))
      );
    }
  };

  const closeStartVisitError = () => {
    if (!startVisitMut.isPending) {
      setStartVisitAppointment(null);
      setStartVisitError('');
      startVisitMut.reset();
    }
  };

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
      render: (r) => {
        if (r.status === 'pending') {
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  statusMut.mutate({
                    id: r.id,
                    status: 'confirmed',
                  })
                }
                loading={
                  statusMut.isPending &&
                  statusMut.variables?.id === r.id &&
                  statusMut.variables?.status === 'confirmed'
                }
              >
                {t('appointments.confirm', { defaultValue: 'Confirm' })}
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  statusMut.mutate({
                    id: r.id,
                    status: 'cancelled',
                  })
                }
                loading={
                  statusMut.isPending &&
                  statusMut.variables?.id === r.id &&
                  statusMut.variables?.status === 'cancelled'
                }
              >
                {t('appointments.cancel', { defaultValue: 'Cancel' })}
              </Button>
            </div>
          );
        }

        if (r.status === 'confirmed') {
          return (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStartVisit(r)}
              loading={
                startVisitMut.isPending &&
                startVisitMut.variables === r.id
              }
            >
              {t('appointments.startVisit', {
                defaultValue: 'Start Visit',
              })}
            </Button>
          );
        }

        return null;
      },
    },
  ];

  const fields = [
    {
      name: 'patient_id',
      label: t('appointments.patient'),
      type: 'select',
      options: patients,
      placeholder: patientsLoading
        ? t('appointments.loadingPatients', { defaultValue: 'Loading patients...' })
        : patientsError
          ? patientsErrorMessage || t('appointments.patientsError', { defaultValue: 'Could not load patients.' })
          : t('appointments.selectPatient', { defaultValue: 'Select a patient' }),
    },
  ];


  return (
    <>
      <CrudPage
        title={t('appointments.title')}
        addLabel={t('appointments.newAppointment')}
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        fields={fields}
        initialValues={{ patient_id: '', doctor_id: '', scheduled_date: '', start_time: '', end_time: '', status: 'pending' }}
        extraActions={(
          <Button onClick={() => setBookingOpen(true)}>
            {t('appointments.newAppointment')}
          </Button>
        )}
        onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload })}
        onDelete={(id) => deleteMut.mutateAsync(id)}
        isSubmitting={updateMut.isPending}
      />

      <PatientBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        patients={patients}
        patientsLoading={patientsLoading}
        patientsError={patientsError ? patientsErrorMessage || t('appointments.patientsError', { defaultValue: 'Could not load patients.' }) : ''}
        onSubmit={(values) => createMut.mutateAsync(values).then(() => setBookingOpen(false))}
        isSubmitting={createMut.isPending}
      />

      <Modal
        open={Boolean(startVisitError)}
        onClose={closeStartVisitError}
        title={t('appointments.startVisit', { defaultValue: 'Start Visit' })}
        size="sm"
      >
        <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
          {startVisitError}
        </p>
        <div className="flex justify-end pt-6">
          <Button variant="secondary" onClick={closeStartVisitError}>
            {t('common.close', { defaultValue: 'Close' })}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AppointmentsPage;
