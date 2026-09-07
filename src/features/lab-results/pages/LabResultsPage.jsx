import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import LabResultDetailsModal from '../components/LabResultDetailsModal';
import { useLabResults, useUpdateLabResult, useDeleteLabResult } from '../hooks/useLabResults';
import { useLabRequestItems } from '../hooks/useLabRequestItems';
import { useLabStaffList } from '../../lab/hooks/useLabStaff';
import { formatDate } from '../../../shared/utils/formatters';
import { useRole } from '../../../core/hooks/useRole';

const STATUS_OPTIONS = ['pending', 'processing', 'completed'];
const PER_PAGE = 10;

const EMPTY_VALUES = {
  lab_request_item_id: '',
  lab_staff_id: '',
  value: '',
  notes: '',
  status: 'pending',
  unit: '',
  reference_range: '',
  completed_at: '',
};

const formatUpdatePayload = (values) => ({
  value: values.value !== '' ? Number(values.value) : undefined,
});

const mapRecordToForm = (record) => ({
  lab_request_item_id: record.lab_request_item_id ?? '',
  lab_staff_id: record.lab_staff_id ?? '',
  value: record.value ?? '',
  notes: record.notes ?? '',
  status: record.status ?? 'pending',
  unit: record.unit ?? '',
  reference_range: record.reference_range ?? '',
  completed_at: record.completed_at
    ? String(record.completed_at).replace(' ', 'T').slice(0, 16)
    : '',
});

const LabResultsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { isLabStaff, isAdmin } = useRole();
  const canManage = isLabStaff || isAdmin;
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = {
    page,
    per_page: PER_PAGE,
    ...(search && { search }),
  };
  const { data, isLoading, isFetching } = useLabResults(queryParams);
  const { data: requestItemsData } = useLabRequestItems();
  const { data: labStaffData } = useLabStaffList();
  const updateMut = useUpdateLabResult();
  const deleteMut = useDeleteLabResult();
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const hasServerPagination = pagination.last_page != null || pagination.next_page_url != null || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / PER_PAGE)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || rows.length > 0);

  const requestItems = Array.isArray(requestItemsData?.data)
    ? requestItemsData.data
    : Array.isArray(requestItemsData)
      ? requestItemsData
      : [];

  const labStaffList = Array.isArray(labStaffData?.data)
    ? labStaffData.data
    : Array.isArray(labStaffData)
      ? labStaffData
      : [];

  const requestItemOptions = useMemo(
    () => requestItems.map((item) => ({
      value: item.id,
      label: `#${item.id} · ${t('labResults.visitId')} ${item.visit_id} · ${t('labResults.labTestId')} ${item.lab_test_id}`,
    })),
    [requestItems, t],
  );

  const labStaffOptions = useMemo(
    () => labStaffList.map((s) => ({
      value: s.id,
      label: `${s.profile?.full_name ?? t('labResults.labStaffId')} #${s.id}`,
    })),
    [labStaffList, t],
  );

  const statusOptions = STATUS_OPTIONS.map((s) => ({
    value: s,
    label: t(`status.${s}`, { ns: 'common' }),
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'test',
      label: t('labResults.test'),
      render: (r) => r.lab_request_item?.lab_test?.name ?? `#${r.lab_request_item?.lab_test_id ?? '—'}`,
    },
    {
      key: 'patient',
      label: t('visits.patient'),
      render: (r) => r.lab_request_item?.visit?.appointment?.patient?.profile?.full_name ?? '—',
    },
    {
      key: 'doctor',
      label: t('visits.doctor'),
      render: (r) => r.lab_request_item?.visit?.appointment?.doctor?.employee?.profile?.full_name ?? '—',
    },
    {
      key: 'value',
      label: t('labResults.value'),
      render: (r) => (r.value != null ? `${r.value} ${r.unit ?? ''}`.trim() : '—'),
      dir: 'ltr',
    },
    {
      key: 'reference_range',
      label: t('labResults.referenceRange'),
      cellVariant: 'badge',
    },
    {
      key: 'lab_staff',
      label: t('labResults.labStaffId'),
      render: (r) => r.lab_staff?.employee?.profile?.full_name ?? r.lab_staff?.specialization ?? `#${r.lab_staff_id}`,
    },
    {
      key: 'completed_at',
      label: t('labResults.completedAt'),
      render: (r) => (r.completed_at ? formatDate(r.completed_at) : '—'),
      dir: 'ltr',
    },
  ];

  const fields = [
    {
      name: 'lab_request_item_id',
      label: t('labResults.labRequestItemId'),
      type: 'select',
      options: requestItemOptions,
      fullWidth: true,
      createOnly: true,
    },
    {
      name: 'lab_staff_id',
      label: t('labResults.labStaffId'),
      type: 'select',
      options: labStaffOptions,
      fullWidth: true,
      createOnly: true,
    },
    { name: 'value', label: t('labResults.value'), type: 'number', dir: 'ltr' },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true, createOnly: true },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: statusOptions,
      createOnly: true,
    },
    { name: 'unit', label: t('labResults.unit'), dir: 'ltr', createOnly: true },
    { name: 'reference_range', label: t('labResults.referenceRange'), dir: 'ltr', createOnly: true },
    { name: 'completed_at', label: t('labResults.completedAt'), type: 'datetime-local', dir: 'ltr', createOnly: true },
  ];

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
            placeholder={t('labResults.searchPlaceholder')}
            className="h-10 w-56 rounded-lg border border-gray-200 bg-white pe-3 ps-9 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
          />
        </div>
      </label>
      {searchInput && (
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
        {t('labResults.page', { current: currentPage, total: totalItems })}
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
      title={t('labResults.title')}
      subtitle={t('labResults.pageSubtitle')}
      columns={columns}
      data={rows}
      isLoading={isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!isLoading ? tableFooter : null}
      fields={canManage ? fields : []}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <LabResultDetailsModal open onClose={onClose} result={record} />
      )}

      onUpdate={canManage ? ({ id, payload }) => updateMut.mutateAsync({ id, payload: formatUpdatePayload(payload) }) : undefined}
      isSubmitting={canManage && updateMut.isPending}
    />
  );
};

export default LabResultsPage;
