import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useCreateDiagnosis, useDeleteDiagnosis, useDiagnoses, useUpdateDiagnosis } from '../../visits/hooks/useDiagnoses';
import { usePatients } from '../../patient/hooks/usePatients';
import { formatDate } from '../../../shared/utils/formatters';

const PER_PAGE = 10;

const DoctorDiagnosesPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = { page, per_page: perPage, ...(search && { search }), ...(type && { diagnosis_type: type }) };
  const query = useDiagnoses(queryParams);
  const patientsQuery = usePatients({ per_page: 100 });
  const createMutation = useCreateDiagnosis();
  const updateMutation = useUpdateDiagnosis();
  const deleteMutation = useDeleteDiagnosis();
  const rows = Array.isArray(query.data?.data) ? query.data.data : Array.isArray(query.data) ? query.data : [];
  const patientList = Array.isArray(patientsQuery.data?.data)
    ? patientsQuery.data.data
    : Array.isArray(patientsQuery.data?.data?.data)
      ? patientsQuery.data.data.data
      : Array.isArray(patientsQuery.data)
        ? patientsQuery.data
        : [];
  const patientNamesById = Object.fromEntries(
    patientList.map((patient) => [String(patient.id), patient.profile?.full_name ?? patient.full_name ?? patient.name])
  );
  const pagination = query.data?.meta ?? query.data ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);

  const typeOptions = ['primary', 'secondary'].map((value) => ({
    value,
    label: t(`diagnoses.types.${value}`),
  }));

  const updateDiagnosis = ({ id, payload }) => {
    const { visit_id: _visitId, ...updatePayload } = payload;
    return updateMutation.mutateAsync({ id, payload: updatePayload });
  };

  const columns = [
    {
      key: 'patient',
      label: t('visits.patient'),
      render: (row) => row.visit?.patient?.profile?.full_name
        ?? patientNamesById[String(row.visit?.patient_id)]
        ?? `#${row.visit?.patient_id ?? '—'}`,
    },
    { key: 'diagnosis_code', label: t('diagnoses.code'), dir: 'ltr' },
    { key: 'description', label: t('diagnoses.description') },
    { key: 'diagnosis_type', label: t('diagnoses.type'), cellVariant: 'badge' },
    { key: 'created_at', label: t('diagnoses.diagnosedAt'), render: (row) => formatDate(row.created_at), dir: 'ltr' },
  ];

  const fields = [
    { name: 'visit_id', label: t('diagnoses.visitId'), type: 'number', dir: 'ltr', required: true, createOnly: true },
    { name: 'diagnosis_code', label: t('diagnoses.code'), dir: 'ltr', required: true },
    { name: 'description', label: t('diagnoses.description'), required: true },
    { name: 'diagnosis_type', label: t('diagnoses.type'), type: 'select', options: typeOptions, required: true },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), type: 'textarea', rows: 3, fullWidth: true },
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
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('doctorDiagnoses.searchPlaceholder')} className="h-10 w-60 rounded-lg border border-gray-200 bg-white pe-3 ps-9 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200" />
        </div>
      </label>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('diagnoses.type')}</span>
        <select value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} className="h-10 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200">
          <option value="">{t('common.all', { ns: 'common' })}</option>
          {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {(searchInput || type) && <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setType(''); setPage(1); }} className="h-10 px-3 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">{t('common.clear', { ns: 'common' })}</button>}
    </div>
  );

  const tableFooter = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 text-sm dark:border-surface-800">
      <span className="text-gray-500 dark:text-gray-400">{t('doctorDiagnoses.page', { current: currentPage, total: totalItems })}</span>
      <div className="flex items-center gap-2">
        <select aria-label={t('common.itemsPerPage', { ns: 'common' })} value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200">
          {[10, 20, 50].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <button type="button" disabled={query.isFetching || currentPage <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{t('actions.previous', { ns: 'common' })}</button>
        <button type="button" disabled={query.isFetching || currentPage >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40 dark:border-surface-700">{t('actions.next', { ns: 'common' })}</button>
      </div>
    </div>
  );

  return (
    <CrudPage
      title={t('doctorDiagnoses.title')}
      subtitle={t('doctorDiagnoses.subtitle')}
      addLabel={t('doctorDiagnoses.add')}
      columns={columns}
      data={rows}
      isLoading={query.isLoading}
      fields={fields}
      initialValues={{ visit_id: '', diagnosis_code: '', description: '', diagnosis_type: 'primary', notes: '' }}
      onCreate={(values) => createMutation.mutateAsync({ ...values, visit_id: Number(values.visit_id) })}
      onUpdate={updateDiagnosis}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
      tableToolbar={tableToolbar}
      tableFooter={tableFooter}
    />
  );
};

export default DoctorDiagnosesPage;