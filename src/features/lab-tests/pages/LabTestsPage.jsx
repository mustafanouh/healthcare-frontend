import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useLabTests, useCreateLabTest, useUpdateLabTest, useDeleteLabTest } from '../hooks/useLabTests';

const LabTestsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabTests();
  const createMut = useCreateLabTest();
  const updateMut = useUpdateLabTest();
  const deleteMut = useDeleteLabTest();

  const columns = [
    { key: 'id',           label: t('common.id',   { ns: 'common' }) },
    { key: 'name',         label: t('common.name', { ns: 'common' }) },
    { key: 'normal_range', label: 'Normal Range' },
    { key: 'unit',         label: t('labResults.unit') },
  ];

  const fields = [
    { name: 'name',         label: t('common.name', { ns: 'common' }), fullWidth: true },
    { name: 'normal_range', label: 'Normal Range', dir: 'ltr' },
    { name: 'unit',         label: t('labResults.unit'), dir: 'ltr' },
  ];

  return (
    <CrudPage
      title={t('nav.labTests', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ name: '', normal_range: '', unit: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabTestsPage;
