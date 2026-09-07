import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import PatientDetailsModal from '../components/PatientDetailsModal';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY_VALUES = {
  user_id: '',
  full_name: '',
  national_number: '',
  phone: '',
  gender: 'male',
  date_of_birth: '',
  address: '',
  blood_type: 'A+',
  height: '',
  weight: '',
  allergies: '',
  chronic_diseases: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
};

const formatCreatePayload = (values) => ({
  user_id: Number(values.user_id),
  full_name: values.full_name,
  national_number: values.national_number,
  phone: values.phone,
  gender: values.gender,
  date_of_birth: values.date_of_birth,
  address: values.address,
  blood_type: values.blood_type,
  height: Number(values.height),
  weight: Number(values.weight),
  allergies: values.allergies,
  chronic_diseases: values.chronic_diseases,
  emergency_contact_name: values.emergency_contact_name,
  emergency_contact_phone: values.emergency_contact_phone,
  emergency_contact_relation: values.emergency_contact_relation,
});

const formatUpdatePayload = (values) => ({
  full_name: values.full_name,
  national_number: values.national_number,
  phone: values.phone,
  gender: values.gender,
  date_of_birth: values.date_of_birth,
  address: values.address,
  blood_type: values.blood_type,
  height: Number(values.height),
  weight: Number(values.weight),
  allergies: values.allergies,
  chronic_diseases: values.chronic_diseases,
  emergency_contact_name: values.emergency_contact_name,
  emergency_contact_phone: values.emergency_contact_phone,
  emergency_contact_relation: values.emergency_contact_relation,
});

const mapRecordToForm = (record) => ({
  user_id: record.profile?.user_id ?? '',
  full_name: record.profile?.full_name ?? '',
  national_number: record.profile?.national_number ?? '',
  phone: record.profile?.phone ?? '',
  gender: record.profile?.gender ?? 'male',
  date_of_birth: record.profile?.date_of_birth ?? '',
  address: record.profile?.address ?? '',
  blood_type: record.blood_type ?? 'A+',
  height: record.height ?? '',
  weight: record.weight ?? '',
  allergies: record.allergies ?? '',
  chronic_diseases: record.chronic_diseases ?? '',
  emergency_contact_name: record.emergency_contact_name ?? '',
  emergency_contact_phone: record.emergency_contact_phone ?? '',
  emergency_contact_relation: record.emergency_contact_relation ?? '',
});

const PatientsPage = () => {
  const { t } = useTranslation(['dashboard', 'common', 'auth']);
  const navigate = useNavigate();
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
  const { data, isLoading, isFetching } = usePatients(queryParams);
  const createMut = useCreatePatient();
  const updateMut = useUpdatePatient();
  const deleteMut = useDeletePatient();

  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const hasServerPagination = pagination.last_page != null || pagination.next_page_url != null || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || rows.length > 0);

  const genderOptions = [
    { value: 'male', label: t('register.male', { ns: 'auth' }) },
    { value: 'female', label: t('register.female', { ns: 'auth' }) },
  ];

  const bloodOptions = BLOOD_TYPES.map((v) => ({ value: v, label: v }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'name',
      label: t('common.name', { ns: 'common' }),
      render: (r) => r.profile?.full_name ?? '—',
    },
    { key: 'blood_type', label: t('patients.bloodType') },
    {
      key: 'phone',
      label: t('common.phone', { ns: 'common' }),
      render: (r) => r.profile?.phone ?? '—',
    },
    {
      key: 'gender',
      label: t('patients.gender'),
      render: (r) => r.profile?.gender ?? '—',
      cellVariant: 'badge',
    },
  ];

  const fields = [
    { name: 'user_id', label: t('patients.userId'), type: 'number', dir: 'ltr', createOnly: true },
    { name: 'full_name', label: t('common.name', { ns: 'common' }) },
    { name: 'national_number', label: t('patients.nationalNumber'), dir: 'ltr' },
    { name: 'phone', label: t('common.phone', { ns: 'common' }), type: 'tel', dir: 'ltr' },
    { name: 'gender', label: t('patients.gender'), type: 'select', options: genderOptions },
    { name: 'date_of_birth', label: t('patients.dateOfBirth'), type: 'date', dir: 'ltr' },
    { name: 'address', label: t('common.address', { ns: 'common' }), fullWidth: true },
    { name: 'blood_type', label: t('patients.bloodType'), type: 'select', options: bloodOptions },
    { name: 'height', label: t('patients.height'), type: 'number', dir: 'ltr' },
    { name: 'weight', label: t('patients.weight'), type: 'number', dir: 'ltr' },
    { name: 'allergies', label: t('patients.allergies'), fullWidth: true },
    { name: 'chronic_diseases', label: t('patients.chronicDiseases'), fullWidth: true },
    { name: 'emergency_contact_name', label: t('patients.emergencyContactName') },
    { name: 'emergency_contact_phone', label: t('patients.emergencyContactPhone'), type: 'tel', dir: 'ltr' },
    { name: 'emergency_contact_relation', label: t('patients.emergencyContactRelation') },
  ];

  const tableToolbar = (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span>
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('patients.searchPlaceholder')}
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
        {t('patients.page', { current: currentPage, total: totalPages })}
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
      title={t('nav.patients', { ns: 'common' })}
      subtitle={t('patients.pageSubtitle')}
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
        <PatientDetailsModal open onClose={onClose} patient={record} />
      )}
      onView={(patient) => navigate(`/admin/patients/${patient.id}`)}
      // onCreate={(v) => createMut.mutateAsync(formatCreatePayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatUpdatePayload(payload) })}
      // onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PatientsPage;
