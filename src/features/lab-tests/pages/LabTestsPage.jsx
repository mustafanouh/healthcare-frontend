// import { useTranslation } from 'react-i18next';
// import CrudPage from '../../../shared/components/crud/CrudPage';
// import { useLabTests, useCreateLabTest, useUpdateLabTest, useDeleteLabTest } from '../hooks/useLabTests';

// const LabTestsPage = () => {
//   const { t } = useTranslation(['dashboard', 'common']);
//   const { data, isLoading } = useLabTests();
//   const createMut = useCreateLabTest();
//   const updateMut = useUpdateLabTest();
//   const deleteMut = useDeleteLabTest();

//   const columns = [
//     { key: 'id',           label: t('common.id',   { ns: 'common' }) },
//     { key: 'name',         label: t('common.name', { ns: 'common' }) },
//     { key: 'normal_range', label: 'Normal Range' },
//     { key: 'unit',         label: t('labResults.unit') },
//   ];

//   const fields = [
//     { name: 'name',         label: t('common.name', { ns: 'common' }), fullWidth: true },
//     { name: 'normal_range', label: 'Normal Range', dir: 'ltr' },
//     { name: 'unit',         label: t('labResults.unit'), dir: 'ltr' },
//   ];

//   return (
//     <CrudPage
//       title={t('nav.labTests', { ns: 'common' })}
//       addLabel={t('actions.add', { ns: 'common' })}
//       columns={columns}
//       data={data?.data ?? []}
//       isLoading={isLoading}
//       fields={fields}
//       initialValues={{ name: '', normal_range: '', unit: '' }}
//       onCreate={(v) => createMut.mutateAsync(v)}
//       onUpdate={(v) => updateMut.mutateAsync(v)}
//       onDelete={(id) => deleteMut.mutateAsync(id)}
//       isSubmitting={createMut.isPending || updateMut.isPending}
//     />
//   );
// };

// export default LabTestsPage;



import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useLabTests, useCreateLabTest, useUpdateLabTest, useDeleteLabTest } from '../hooks/useLabTests';

const LabTestsPage = () => {
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
  const { data, isLoading, isFetching } = useLabTests(queryParams);
  const createMut = useCreateLabTest();
  const updateMut = useUpdateLabTest();
  const deleteMut = useDeleteLabTest();

  const listData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? listData.length);
  const hasServerPagination = pagination.last_page != null || pagination.next_page_url != null || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || listData.length > 0);

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    { key: 'name', label: t('common.name', { ns: 'common' }) },
    { key: 'range_low', label: 'Range Low' },
    { key: 'range_high', label: 'Range High' },
    { key: 'unit', label: t('labResults.unit') },
  ];

  const fields = [
    { name: 'name', label: t('common.name', { ns: 'common' }), fullWidth: true },
    { name: 'range_low', label: 'Range Low', dir: 'ltr', type: 'number' },
    { name: 'range_high', label: 'Range High', dir: 'ltr', type: 'number' },
    { name: 'unit', label: t('labResults.unit'), dir: 'ltr' },
  ];

  const tableToolbar = (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span>
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('labResults.searchPlaceholder')}
          className="h-10 w-56 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
        />
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
      title={t('nav.labTests', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={listData}
      isLoading={isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!isLoading ? tableFooter : null}
      fields={fields}
      initialValues={{ name: '', range_low: '', range_high: '', unit: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabTestsPage;