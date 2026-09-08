import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { useRole } from '../../../core/hooks/useRole';
import { formatDate, formatTime } from '../../../shared/utils/formatters';
import { parseApiError, parseApiFieldErrors } from '../../../shared/utils/parseApiError';

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
  const [submitErrors, setSubmitErrors] = useState({});

  const { data: facilitiesData, isLoading: facilitiesLoading } = useFacilities();
  const { data: departmentsData, isLoading: departmentsLoading } = useFacilityBookingDepartments(facilityId);
  const { data: specializationsData, isLoading: specializationsLoading } = useFacilityBookingSpecializations(facilityId, departmentId);
  const { data: doctorsData, isLoading: doctorsLoading } = useFacilityBookingDoctors(facilityId, departmentId, specializationId);

  const listFromResponse = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  const facilities = listFromResponse(facilitiesData).filter((facility) => (
    ['hospital', 'clinic'].includes(String(facility.facility_type).toLowerCase())
    && Boolean(facility.is_active)
  ));
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
    setSubmitErrors({});
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitErrors({});
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
      setSubmitErrors(parseApiFieldErrors(error));
    }
  };

  const fieldError = (name) => ({
    error: submitErrors[name],
    touched: Boolean(submitErrors[name]),
  });

  return (
    <Modal open={open} onClose={handleClose} title={t('appointments.newAppointment')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {submitError}
          </div>
        )}
        {!patientId && <Select label={t('appointments.patient')} name="patient_id" value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)} options={patients} placeholder={patientsLoading ? t('appointments.loadingPatients', { defaultValue: 'Loading patients...' }) : patientsError || t('appointments.selectPatient', { defaultValue: 'Select a patient' })} disabled={patientsLoading || Boolean(patientsError)} required {...fieldError('patient_id')} />}

        <Select label={t('appointments.facility', { defaultValue: 'Facility' })} name="facility_id" value={facilityId} onChange={(event) => setFacilityId(event.target.value)} options={facilityOptions} placeholder={facilitiesLoading ? t('appointments.loadingFacilities', { defaultValue: 'Loading facilities...' }) : t('appointments.selectFacility', { defaultValue: 'Select a facility' })} disabled={facilitiesLoading} required {...fieldError('facility_id')} />
        <Select label={t('appointments.department', { defaultValue: 'Department' })} name="department_id" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} options={departmentOptions} placeholder={departmentsLoading ? t('appointments.loadingDepartments', { defaultValue: 'Loading departments...' }) : t('appointments.selectDepartment', { defaultValue: 'Select a department' })} disabled={!facilityId || departmentsLoading} required {...fieldError('department_id')} />
        <Select label={t('appointments.specialization', { defaultValue: 'Specialization' })} name="specialization_id" value={specializationId} onChange={(event) => setSpecializationId(event.target.value)} options={specializationOptions} placeholder={specializationsLoading ? t('appointments.loadingSpecializations', { defaultValue: 'Loading specializations...' }) : t('appointments.selectSpecialization', { defaultValue: 'Select a specialization' })} disabled={!departmentId || specializationsLoading} required {...fieldError('specialization_id')} />
        <Select label={t('appointments.doctor')} name="doctor_id" value={doctorId} onChange={(event) => setDoctorId(event.target.value)} options={doctorOptions} placeholder={doctorsLoading ? t('appointments.loadingDoctors', { defaultValue: 'Loading doctors...' }) : t('appointments.selectDoctor', { defaultValue: 'Select a doctor' })} disabled={!specializationId || doctorsLoading} required {...fieldError('doctor_id')} />

        <Input
          label={t('appointments.scheduledDate')}
          name="scheduled_date"
          type="date"
          value={scheduledDate}
          onChange={(event) => setScheduledDate(event.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
          {...fieldError('scheduled_date')}
        />

        <Input
          label={t('appointments.reason', { defaultValue: 'Reason for visit' })}
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('appointments.reasonPlaceholder', { defaultValue: 'Describe the reason for your appointment' })}
          required
          {...fieldError('reason')}
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
            {...fieldError('start_time')}
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

const APPOINTMENT_STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const AppointmentsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const { isDoctor } = useRole();
  const navigate = useNavigate();
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
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
  const queryParams = isPatientPage
    ? { patient_id: patientId }
    : { page, per_page: perPage, ...(search && { search }), ...(status && { status }) };
  const { data, isLoading, isFetching } = useAppointments(queryParams);

  const handleStartVisit = async (appointment) => {
    setStartVisitAppointment(appointment);
    setStartVisitError('');

    try {
      const response = await startVisitMut.mutateAsync(appointment.id);
      const visit = response?.data?.id
        ? response.data
        : response?.data?.data ?? response?.data ?? response;
      const visitId = visit?.id ?? visit?.visit_id;
      if (visitId) navigate(`/doctor/visits/${visitId}/active`);
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
    ...(!isDoctor ? [{
      key: 'doctor', label: t('appointments.doctor'), render: (r) => r.doctor?.employee?.profile?.full_name
        ?? r.doctor?.profile?.full_name
        ?? `#${r.doctor_id}`
    }] : []),
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

  const paginatedData = data?.data && !Array.isArray(data.data) ? data.data : data;
  const appointmentRows = Array.isArray(paginatedData?.data)
    ? paginatedData.data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
  const pagination = data?.meta ?? paginatedData?.meta ?? paginatedData ?? {};
  const totalItems = Number(pagination.total ?? appointmentRows.length);
  const hasServerPagination = pagination.last_page != null
    || pagination.next_page_url != null
    || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || appointmentRows.length > 0);

  const tableToolbar = (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
          </svg>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('appointments.searchPlaceholder', { ns: 'common', defaultValue: 'Search appointments' })}
            className="h-10 w-56 rounded-lg border border-gray-200 bg-white px-3 pl-9 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 rtl:pl-3 rtl:pr-9"
          />
        </div>
      </label>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('common.itemsPerPage', { ns: 'common' })}</span>
        <select
          value={perPage}
          onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }}
          className="h-10 min-w-24 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
        >
          {[10, 25, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('common.status', { ns: 'common' })}</span>
        <select
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          className="h-10 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
        >
          <option value="">{t('common.all', { ns: 'common' })}</option>
          {APPOINTMENT_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>{t(`status.${option}`, { ns: 'common' })}</option>
          ))}
        </select>
      </label>
      {(searchInput || search || status) && (
        <button
          type="button"
          onClick={() => { setSearchInput(''); setSearch(''); setStatus(''); setPage(1); }}
          className="h-10 px-3 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          {t('common.clear', { ns: 'common' })}
        </button>
      )}
    </div>
  );

  const tableFooter = (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm dark:border-surface-800">
      <span className="text-gray-500 dark:text-gray-400">
        {t('common.page', { ns: 'common' })} {currentPage} / {totalPages}
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={isFetching || currentPage <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">
          {t('actions.previous', { ns: 'common' })}
        </button>
        <button type="button" disabled={isFetching || !hasNextPage} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">
          {isFetching ? t('actions.loading', { ns: 'common' }) : t('actions.next', { ns: 'common' })}
        </button>
      </div>
    </div>
  );


  return (
    <>
      <CrudPage
        title={t('appointments.title')}
        addLabel={t('appointments.newAppointment')}
        columns={columns}
        data={appointmentRows}
        isLoading={isLoading}
        tableToolbar={tableToolbar}
        tableFooter={!isLoading ? tableFooter : null}
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
