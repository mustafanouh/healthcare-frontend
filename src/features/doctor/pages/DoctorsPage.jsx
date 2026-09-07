import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CrudPage from '../../../shared/components/crud/CrudPage';
import DoctorDetailsModal from '../components/DoctorDetailsModal';
import DoctorsTable from '../components/DoctorsTable';
import { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from '../hooks/useDoctors';
import { useFacilityDeptSpecs } from '../../facilities/hooks/useFacilityDeptSpecs';
import { useFacilityDepartments } from '../../facilities/hooks/useFacilityDepartments';
import { useSpecializations } from '../../facilities/hooks/useSpecializations';
import { getDoctorPlacement } from '../utils/doctorHelpers';
import {
  buildDeptSpecLabel,
  mergeDeptSpecOptions,
  toDeptSpecOption,
} from '../utils/deptSpecOptions';

const parseLanguages = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const formatLanguagesForForm = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  return value ?? '';
};

const EMPTY_VALUES = {
  facility_department_specialization_id: '',
  employee_id: '',
  qualification: '',
  years_of_experience: '',
  biography: '',
  achievements: '',
  languages: '',
};

const formatPayload = (values) => ({
  facility_department_specialization_id: String(values.facility_department_specialization_id),
  employee_id: String(values.employee_id),
  qualification: values.qualification,
  years_of_experience: Number(values.years_of_experience),
  biography: values.biography,
  achievements: values.achievements,
  languages: parseLanguages(values.languages),
});

const mapRecordToForm = (record) => ({
  facility_department_specialization_id:
    record?.facility_department_specialization_id != null
      ? String(record.facility_department_specialization_id)
      : '',
  employee_id: record?.employee_id ?? '',
  qualification: record?.qualification ?? '',
  years_of_experience: record?.years_of_experience ?? '',
  biography: record?.biography ?? '',
  achievements: record?.achievements ?? '',
  languages: formatLanguagesForForm(record?.languages),
});

const DoctorsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
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
  const { data, isLoading, isFetching } = useDoctors(queryParams);
  const { data: deptSpecData } = useFacilityDeptSpecs();
  const { data: facilityDeptData } = useFacilityDepartments();
  const { data: specData } = useSpecializations();
  const createMut = useCreateDoctor();
  const updateMut = useUpdateDoctor();
  const deleteMut = useDeleteDoctor();

  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const pagination = data?.meta ?? data ?? {};
  const totalItems = Number(pagination.total ?? rows.length);
  const hasServerPagination = pagination.last_page != null || pagination.next_page_url != null || pagination.total != null;
  const totalPages = Number(pagination.last_page ?? Math.max(1, Math.ceil(totalItems / perPage)));
  const currentPage = Number(pagination.current_page ?? page);
  const hasNextPage = hasServerPagination
    ? currentPage < totalPages
    : (page === 1 || rows.length > 0);

  const deptSpecs = useMemo(() => {
    const facilityDepartments = Array.isArray(facilityDeptData?.data)
      ? facilityDeptData.data
      : Array.isArray(facilityDeptData)
        ? facilityDeptData
        : [];

    const specializations = Array.isArray(specData?.data)
      ? specData.data
      : Array.isArray(specData)
        ? specData
        : [];

    const deptSpecList = Array.isArray(deptSpecData?.data)
      ? deptSpecData.data
      : Array.isArray(deptSpecData)
        ? deptSpecData
        : [];

    const doctorsList = rows;

    const fdMap = Object.fromEntries(facilityDepartments.map((fd) => [fd.id, fd]));
    const specMap = Object.fromEntries(specializations.map((s) => [s.id, s]));

    const fromApi = deptSpecList.map((s) =>
      toDeptSpecOption(s.id, buildDeptSpecLabel(s, fdMap, specMap)),
    );

    const fromDoctors = doctorsList
      .filter((d) => d.facility_department_specialization_id)
      .map((d) =>
        toDeptSpecOption(
          d.facility_department_specialization_id,
          buildDeptSpecLabel(getDoctorPlacement(d), fdMap, specMap),
        ),
      );

    return mergeDeptSpecOptions(fromApi, fromDoctors);
  }, [deptSpecData, facilityDeptData, specData, rows]);

  const fields = [
    {
      name: 'facility_department_specialization_id',
      label: t('doctors.workPlacement'),
      type: 'select',
      options: deptSpecs,
      fullWidth: true,
    },
    { name: 'employee_id', label: t('doctors.employeeId'), type: 'number', dir: 'ltr' },
    { name: 'qualification', label: t('doctors.qualification') },
    { name: 'years_of_experience', label: t('doctors.yearsOfExperience'), type: 'number', dir: 'ltr' },
    { name: 'languages', label: t('doctors.languages'), placeholder: t('doctors.languagesHint'), fullWidth: true },
    { name: 'biography', label: t('doctors.biography'), fullWidth: true },
    { name: 'achievements', label: t('doctors.achievements'), fullWidth: true },
  ];

  const tableToolbar = (
    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        <span className="mb-1.5 block font-medium">{t('actions.search', { ns: 'common' })}</span>
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('doctors.searchPlaceholder')}
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
        {t('doctors.page', { current: currentPage, total: totalPages })}
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
      title={t('nav.doctors', { ns: 'common' })}
      subtitle={t('doctors.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={[]}
      TableComponent={DoctorsTable}
      data={rows}
      isLoading={isLoading}
      tableToolbar={tableToolbar}
      tableFooter={!isLoading ? tableFooter : null}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <DoctorDetailsModal open onClose={onClose} doctor={record} />
      )}
      onView={(doctor) => navigate(`/admin/doctors/${doctor.id}`)}
      onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DoctorsPage;
