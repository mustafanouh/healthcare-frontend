import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import { useVisits, useDeleteVisit } from '../hooks/useVisits';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { formatDate, formatTime } from '../../../shared/utils/formatters';
import { useRole } from '../../../core/hooks/useRole';

const VisitsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { isDoctor , isPatient } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = {
    page,
    per_page: perPage,
    ...(search && { search }),
  };
  const { data, isLoading, isFetching } = useVisits(queryParams);
  const { data: appointmentsData } = useAppointments();
  const deleteMut = useDeleteVisit();

  const listData = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? listData.length);
  const hasServerPagination = pagination.last_page != null
    || pagination.next_page_url != null
    || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || listData.length > 0);

  const appointments = Array.isArray(appointmentsData?.data)
    ? appointmentsData.data
    : Array.isArray(appointmentsData)
      ? appointmentsData
      : [];

  const appointmentOptions = appointments.map((appointment) => ({
    value: String(appointment.id),
    label: `${appointment.doctor?.profile?.full_name ?? `Dr #${appointment.doctor_id}`} — ${appointment.patient?.profile?.full_name ?? `Patient #${appointment.patient_id}`} — ${formatTime(appointment.start_time)}`,
  }));

 const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    ...(!isPatient ? [{ key: 'patient', label: t('appointments.patient'), render: (r) => r.patient?.profile?.full_name ?? `#${r.patient_id}` }] : []),
    ...(!isDoctor ? [{ key: 'doctor', label: t('appointments.doctor'), render: (r) => r.doctor?.employee?.profile?.full_name ?? `#${r.doctor_id}` }] : []),
    { key: 'status', label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    { key: 'visited_at', label: t('visits.visitedAt'), render: (r) => formatDate(r.visited_at) },
    // { key: 'notes', label: t('common.notes', { ns: 'common' }) },
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
    // { name: 'notes', label: t('common.notes', { ns: 'common' }), type: 'textarea', fullWidth: true },
    { name: 'visited_at', label: t('visits.visitedAt'), type: 'datetime-local', dir: 'ltr' },
  ];

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
            maxLength={255}
            placeholder={t('visits.searchPlaceholder', { ns: 'common', defaultValue: 'Search visits' })}
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
      {(searchInput || search) && (
        <button
          type="button"
          onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
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
    <CrudPage
      title={t('visits.title')}
      // addLabel={t('visits.newVisit')}
      columns={columns}
      data={listData}
      isLoading={isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!isLoading ? tableFooter : null}
      onView={(row) => navigate(`${isDoctor ? '/doctor' : isPatient ? '/patient' : '/admin'}/visits/${row.id}`)}
      fields={fields}
      initialValues={{ appointment_id: searchParams.get('appointment_id') ?? '', notes: '', visited_at: '' }}
      onDelete={(id) => deleteMut.mutateAsync(id)}
    />
  );
};

export default VisitsPage;







