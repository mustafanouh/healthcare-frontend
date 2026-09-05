import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import LabStaffDetailsModal from '../components/LabStaffDetailsModal';
import { useLabStaffList, useCreateLabStaff, useUpdateLabStaff, useDeleteLabStaff } from '../hooks/useLabStaff';

const EMPTY_VALUES = {
  employee_id: '',
  specialization: '',
  degree: '',
  years_of_experience: '',
  license_number: '',
};

const formatPayload = (values) => ({
  employee_id: Number(values.employee_id),
  specialization: values.specialization,
  degree: values.degree,
  years_of_experience: Number(values.years_of_experience),
  license_number: values.license_number,
});

const mapRecordToForm = (record) => ({
  employee_id: record.employee_id ?? record.employee?.id ?? '',
  specialization: record.specialization ?? '',
  degree: record.degree ?? '',
  years_of_experience: record.years_of_experience ?? '',
  license_number: record.license_number ?? '',
});

const LabStaffPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabStaffList();
  const createMut = useCreateLabStaff();
  const updateMut = useUpdateLabStaff();
  const deleteMut = useDeleteLabStaff();

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'name',
      label: t('common.name', { ns: 'common' }),
      render: (r) => r.employee?.profile?.full_name ?? '—',
    },
    {
      key: 'specialization',
      label: t('labStaff.specialization'),
      cellVariant: 'badge',
    },
    {
      key: 'facility',
      label: t('nav.facilities', { ns: 'common' }),
      render: (r) => r.employee?.facility?.name ?? '—',
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
      render: (r) => (r.employee?.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })),
      cellVariant: 'badge',
    },
  ];

  const fields = [
    { name: 'employee_id', label: t('labStaff.employeeId'), type: 'number', dir: 'ltr' },
    { name: 'specialization', label: t('labStaff.specialization') },
    { name: 'degree', label: t('labStaff.degree'), fullWidth: true },
    { name: 'years_of_experience', label: t('labStaff.yearsOfExperience'), type: 'number', dir: 'ltr' },
    { name: 'license_number', label: t('labStaff.licenseNumber'), dir: 'ltr' },
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
      // onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabStaffPage;
