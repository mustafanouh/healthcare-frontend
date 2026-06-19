import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { usePharmacists, useCreatePharmacist, useUpdatePharmacist, useDeletePharmacist } from '../hooks/usePharmacists';
import { useFacilities } from '../../facilities/hooks/useFacilities';

const PharmacistsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = usePharmacists();
  const { data: facilData } = useFacilities();
  const createMut = useCreatePharmacist();
  const updateMut = useUpdatePharmacist();
  const deleteMut = useDeletePharmacist();

  const facilities = (facilData?.data ?? []).map((f) => ({ value: f.id, label: f.name }));

  const columns = [
    { key: 'id',       label: t('common.id',   { ns: 'common' }) },
    { key: 'name',     label: t('common.name', { ns: 'common' }), render: (r) => r.profile?.full_name ?? '—' },
    { key: 'facility', label: t('nav.facilities', { ns: 'common' }), render: (r) => r.facility?.name ?? '—' },
  ];

  const fields = [
    { name: 'facility_id', label: t('nav.facilities', { ns: 'common' }), type: 'select', options: facilities },
  ];

  return (
    <CrudPage
      title={t('nav.pharmacists', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ facility_id: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PharmacistsPage;
