import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  profile_id: '',
  qualification: '',
  years_of_experience: '',
  biography: '',
  achievements: '',
  languages: '',
};

const formatPayload = (values) => ({
  facility_department_specialization_id: String(values.facility_department_specialization_id),
  profile_id: String(values.profile_id),
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
  profile_id: record?.profile_id ?? '',
  qualification: record?.qualification ?? '',
  years_of_experience: record?.years_of_experience ?? '',
  biography: record?.biography ?? '',
  achievements: record?.achievements ?? '',
  languages: formatLanguagesForForm(record?.languages),
});

const DoctorsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useDoctors();
  const { data: deptSpecData } = useFacilityDeptSpecs();
  const { data: facilityDeptData } = useFacilityDepartments();
  const { data: specData } = useSpecializations();
  const createMut = useCreateDoctor();
  const updateMut = useUpdateDoctor();
  const deleteMut = useDeleteDoctor();

  const deptSpecs = useMemo(() => {
    const fdMap = Object.fromEntries(
      (facilityDeptData?.data ?? []).map((fd) => [fd.id, fd]),
    );
    const specMap = Object.fromEntries(
      (specData?.data ?? []).map((s) => [s.id, s]),
    );

    const fromApi = (deptSpecData?.data ?? []).map((s) =>
      toDeptSpecOption(s.id, buildDeptSpecLabel(s, fdMap, specMap)),
    );

    const fromDoctors = (data?.data ?? [])
      .filter((d) => d.facility_department_specialization_id)
      .map((d) =>
        toDeptSpecOption(
          d.facility_department_specialization_id,
          buildDeptSpecLabel(getDoctorPlacement(d), fdMap, specMap),
        ),
      );

    return mergeDeptSpecOptions(fromApi, fromDoctors);
  }, [deptSpecData, facilityDeptData, specData, data]);

  const fields = [
    {
      name: 'facility_department_specialization_id',
      label: t('doctors.workPlacement'),
      type: 'select',
      options: deptSpecs,
      fullWidth: true,
    },
    { name: 'profile_id', label: t('doctors.profileId'), type: 'number', dir: 'ltr' },
    { name: 'qualification', label: t('doctors.qualification') },
    { name: 'years_of_experience', label: t('doctors.yearsOfExperience'), type: 'number', dir: 'ltr' },
    { name: 'languages', label: t('doctors.languages'), placeholder: t('doctors.languagesHint'), fullWidth: true },
    { name: 'biography', label: t('doctors.biography'), fullWidth: true },
    { name: 'achievements', label: t('doctors.achievements'), fullWidth: true },
  ];

  return (
    <CrudPage
      title={t('nav.doctors', { ns: 'common' })}
      subtitle={t('doctors.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={[]}
      TableComponent={DoctorsTable}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <DoctorDetailsModal open onClose={onClose} doctor={record} />
      )}
      onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DoctorsPage;
