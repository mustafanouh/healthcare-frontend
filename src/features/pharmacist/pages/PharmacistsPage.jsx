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
  const { data, isLoading } = usePharmacists();
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

  return (
    <CrudPage
      title={t('nav.pharmacists', { ns: 'common' })}
      subtitle={t('pharmacists.pageSubtitle')}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={rows}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <PharmacistDetailsModal open onClose={onClose} pharmacist={record} />
      )}
      onCreate={(v) => createMut.mutateAsync(formatPayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatPayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PharmacistsPage;
