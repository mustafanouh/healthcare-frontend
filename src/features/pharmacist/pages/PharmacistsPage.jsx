import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import PharmacistDetailsModal from '../components/PharmacistDetailsModal';
import { usePharmacists, useCreatePharmacist, useUpdatePharmacist, useDeletePharmacist } from '../hooks/usePharmacists';

const EMPTY_VALUES = {
  employee_id: '',
  degree: '',
  years_of_experience: '',
  license_number: '',
};

const formatPayload = (values) => ({
  employee_id: Number(values.employee_id),
  degree: values.degree,
  years_of_experience: Number(values.years_of_experience),
  license_number: values.license_number,
});

const mapRecordToForm = (record) => ({
  employee_id: record.employee_id ?? record.employee?.id ?? '',
  degree: record.degree ?? '',
  years_of_experience: record.years_of_experience ?? '',
  license_number: record.license_number ?? '',
});

const PharmacistsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
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
  const { data, isLoading, isFetching } = usePharmacists(queryParams);
  const createMut = useCreatePharmacist();
  const updateMut = useUpdatePharmacist();
  const deleteMut = useDeletePharmacist();

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'name',
      label: t('common.name', { ns: 'common' }),
      render: (r) => r.employee?.profile?.full_name ?? '—',
    },
    {
      key: 'facility',
      label: t('nav.facilities', { ns: 'common' }),
      render: (r) => r.employee?.facility?.name ?? '—',
    },
    { key: 'degree', label: t('pharmacists.degree') },
    {
      key: 'years_of_experience',
      label: t('pharmacists.yearsOfExperience'),
      render: (r) => r.years_of_experience ?? '—',
    },
    {
      key: 'is_active',
      label: t('common.status', { ns: 'common' }),
      render: (r) => (r.employee?.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })),
      cellVariant: 'badge',
    },
  ];

  const fields = [
    { name: 'employee_id', label: t('pharmacists.employeeId'), type: 'number', dir: 'ltr' },
    { name: 'degree', label: t('pharmacists.degree'), fullWidth: true },
    { name: 'years_of_experience', label: t('pharmacists.yearsOfExperience'), type: 'number', dir: 'ltr' },
    { name: 'license_number', label: t('pharmacists.licenseNumber'), dir: 'ltr' },
  ];

  const rows = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];
  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const hasServerPagination = pagination.last_page != null
    || pagination.next_page_url != null
    || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || rows.length > 0);

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
            placeholder={t('pharmacists.searchPlaceholder')}
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
      title={t('nav.pharmacists', { ns: 'common' })}
      subtitle={t('pharmacists.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={rows}
      isLoading={isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!isLoading ? tableFooter : null}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <PharmacistDetailsModal open onClose={onClose} pharmacist={record} />
      )}
      // onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      // onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PharmacistsPage;
