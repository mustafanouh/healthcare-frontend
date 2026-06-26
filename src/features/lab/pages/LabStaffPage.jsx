import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import LabStaffDetailsModal from '../components/LabStaffDetailsModal';
import { useLabStaffList, useCreateLabStaff, useUpdateLabStaff, useDeleteLabStaff } from '../hooks/useLabStaff';
import { useFacilities } from '../../facilities/hooks/useFacilities';

const EMPTY_VALUES = {
  facility_id: '',
  profile_id: '',
  specialization: '',
  degree: '',
  years_of_experience: '',
  license_number: '',
  is_active: 'true',
};

const formatPayload = (values) => ({
  facility_id: Number(values.facility_id),
  profile_id: Number(values.profile_id),
  specialization: values.specialization,
  degree: values.degree,
  years_of_experience: Number(values.years_of_experience),
  license_number: values.license_number,
  is_active: values.is_active === true || values.is_active === 'true',
});

const mapRecordToForm = (record) => ({
  facility_id: record.facility_id ?? record.facility?.id ?? '',
  profile_id: record.profile_id ?? record.profile?.id ?? '',
  specialization: record.specialization ?? '',
  degree: record.degree ?? '',
  years_of_experience: record.years_of_experience ?? '',
  license_number: record.license_number ?? '',
  is_active: record.is_active != null ? String(record.is_active) : 'true',
});

const LabStaffPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabStaffList();
  const { data: facilData } = useFacilities();
  const createMut = useCreateLabStaff();
  const updateMut = useUpdateLabStaff();
  const deleteMut = useDeleteLabStaff();

  const facilities = (facilData?.data ?? []).map((f) => ({ value: f.id, label: f.name }));

  const activeOptions = [
    { value: 'true', label: t('status.active', { ns: 'common' }) },
    { value: 'false', label: t('status.inactive', { ns: 'common' }) },
  ];

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'name',
      label: t('common.name', { ns: 'common' }),
      render: (r) => r.profile?.full_name ?? '—',
    },
    {
      key: 'specialization',
      label: t('labStaff.specialization'),
      cellVariant: 'badge',
    },
    {
      key: 'facility',
      label: t('nav.facilities', { ns: 'common' }),
      render: (r) => r.facility?.name ?? '—',
    },
    { key: 'degree', label: t('labStaff.degree') },
    {
      key: 'years_of_experience',
      label: t('labStaff.yearsOfExperience'),
      render: (r) => r.years_of_experience ?? '—',
    },
    {
      key: 'is_active',
      label: t('common.status', { ns: 'common' }),
      render: (r) => (r.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })),
      cellVariant: 'badge',
    },
  ];

  const fields = [
    { name: 'facility_id', label: t('nav.facilities', { ns: 'common' }), type: 'select', options: facilities },
    { name: 'profile_id', label: t('labStaff.profileId'), type: 'number', dir: 'ltr' },
    { name: 'specialization', label: t('labStaff.specialization') },
    { name: 'degree', label: t('labStaff.degree'), fullWidth: true },
    { name: 'years_of_experience', label: t('labStaff.yearsOfExperience'), type: 'number', dir: 'ltr' },
    { name: 'license_number', label: t('labStaff.licenseNumber'), dir: 'ltr' },
    { name: 'is_active', label: t('common.status', { ns: 'common' }), type: 'select', options: activeOptions },
  ];

  return (
    <CrudPage
      title={t('nav.labStaff', { ns: 'common' })}
      subtitle={t('labStaff.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <LabStaffDetailsModal open onClose={onClose} member={record} />
      )}
      onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabStaffPage;
