import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import PrescriptionDetailsModal from '../components/PrescriptionDetailsModal';
import { usePrescriptions, useCreatePrescription, useUpdatePrescription, useDeletePrescription } from '../hooks/usePrescriptions';
import { useVisits } from '../../visits/hooks/useVisits';
import { formatDate } from '../../../shared/utils/formatters';
import { useRole } from '../../../core/hooks/useRole';

const STATUS_OPTIONS = ['pending', 'dispensed', 'cancelled'];

const PrescriptionsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { isDoctor, isAdmin, isPharmacist } = useRole();
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

  const queryParams = {
    page,
    per_page: perPage,
    ...(search && { search }),
    ...(status && { status }),
  };
  const prescriptionsQuery = usePrescriptions(queryParams);
  const prescriptionsData = prescriptionsQuery.data;
  const { data: visitsData } = useVisits();
  const createMut = useCreatePrescription();
  const updateMut = useUpdatePrescription();
  const deleteMut = useDeletePrescription();

  const rows = Array.isArray(prescriptionsData?.data)
    ? prescriptionsData.data
    : Array.isArray(prescriptionsData)
      ? prescriptionsData
      : [];
  const pagination = prescriptionsData?.meta ?? prescriptionsData ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const hasServerPagination = pagination.last_page != null || pagination.next_page_url != null || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || rows.length > 0);

  const visitsList = Array.isArray(visitsData?.data)
    ? visitsData.data
    : Array.isArray(visitsData)
      ? visitsData
      : [];

  const visitOptions = visitsList.map((visit) => ({
    value: String(visit.id),
    label: `${visit.patient?.profile?.full_name ?? `Patient #${visit.patient_id}`} — ${formatDate(visit.visited_at)}`,
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'doctor',
      label: t('appointments.doctor'),
      render: (prescription) => prescription.visit?.doctor?.employee?.profile?.full_name
        ?? prescription.visit?.doctor?.profile?.full_name
        ?? `#${prescription.visit?.doctor_id ?? '—'}`,
    },
    { key: 'patient', label: t('appointments.patient'), render: (prescription) => prescription.visit?.patient?.profile?.full_name ?? `#${prescription.visit?.patient_id ?? '—'}` },
    { key: 'status', label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    { key: 'notes', label: t('common.notes', { ns: 'common' }) },
    { key: 'created_at', label: t('common.createdAt', { ns: 'common' }), render: (r) => formatDate(r.created_at) },
  ];

  const fields = [
   
    { name: 'visit_id', label: 'Visit', type: 'select', options: visitOptions, placeholder: 'Select visit', fullWidth: true },
   { name: 'patient_id', label: 'Patient', type: 'select', options: visitOptions, placeholder: 'Select patient', fullWidth: true },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: ['pending', 'dispensed', 'cancelled'].map((s) => ({
        value: s, label: t(`status.${s}`, { ns: 'common' }),
      })),
    },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
  ];

  const normalizePayload = (values) => ({
    ...values,
    visit_id: Number(values.visit_id),
  });

  const canManage = isDoctor || isAdmin;

  const tableToolbar = (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span>
        <div className="relative">
          <svg className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path d="m20 20-4-4" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('actions.search', { ns: 'common' })}
            className="h-10 w-56 rounded-lg border border-gray-200 bg-white pe-3 ps-9 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
          />
        </div>
      </label>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('common.status', { ns: 'common' })}</span>
        <select
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          className="h-10 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
        >
          <option value="">{t('common.all', { ns: 'common' })}</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>{t(`status.${option}`, { ns: 'common' })}</option>
          ))}
        </select>
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
      {(searchInput || search || status) && (
        <button
          type="button"
          onClick={() => { setSearchInput(''); setSearch(''); setStatus(''); setPage(1); }}
          className="h-10 rounded-lg bg-red-50 px-3 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60 dark:hover:text-red-200"
        >
          {t('common.clear', { ns: 'common' })}
        </button>
      )}
    </div>
  );

  const tableFooter = (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm dark:border-surface-800">
      <span className="text-gray-500 dark:text-gray-400">
        {t('prescriptions.page', { current: currentPage, total: totalItems })}
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={prescriptionsQuery.isFetching || currentPage <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">
          {t('actions.previous', { ns: 'common' })}
        </button>
        <button type="button" disabled={prescriptionsQuery.isFetching || !hasNextPage} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">
          {prescriptionsQuery.isFetching ? t('actions.loading', { ns: 'common' }) : t('actions.next', { ns: 'common' })}
        </button>
      </div>
    </div>
  );

  return (
    <CrudPage
      title={t('prescriptions.title')}
      addLabel={t('prescriptions.newPrescription')}
      columns={columns}
      data={rows}
      isLoading={prescriptionsQuery.isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!prescriptionsQuery.isLoading ? tableFooter : null}
      fields={canManage ? fields : []}
      initialValues={{ visit_id: '', status: 'pending', notes: '' }}
      onCreate={canManage ? (v) => createMut.mutateAsync(normalizePayload(v)) : undefined}
      onUpdate={canManage ? ({ id, payload }) => updateMut.mutateAsync({ id, payload: normalizePayload(payload) }) : undefined}
      onDelete={canManage ? (id) => deleteMut.mutateAsync(id) : undefined}
      isSubmitting={canManage && (createMut.isPending || updateMut.isPending)}
      renderDetailsModal={({ record, onClose }) => (
        <PrescriptionDetailsModal open onClose={onClose} prescription={record} canDispense={isPharmacist || isAdmin} />
      )}
    />
  );
};

export default PrescriptionsPage;
