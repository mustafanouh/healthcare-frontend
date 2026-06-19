import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '../hooks/useDepartments';

const DepartmentsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useDepartments();
  const createMut = useCreateDepartment();
  const updateMut = useUpdateDepartment();
  const deleteMut = useDeleteDepartment();

  const columns = [
    { key: 'id',   label: t('common.id',   { ns: 'common' }) },
    { key: 'name', label: t('common.name', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'name', label: t('common.name', { ns: 'common' }) },
  ];

  return (
    <CrudPage
      title={t('nav.departments', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ name: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default DepartmentsPage;
