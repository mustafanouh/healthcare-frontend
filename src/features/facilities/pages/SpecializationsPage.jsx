import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useSpecializations, useCreateSpecialization, useUpdateSpecialization, useDeleteSpecialization } from '../hooks/useSpecializations';
import { useDepartments } from '../hooks/useDepartments';

const SpecializationsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useSpecializations();
  const { data: deptData }  = useDepartments();
  const createMut = useCreateSpecialization();
  const updateMut = useUpdateSpecialization();
  const deleteMut = useDeleteSpecialization();

  const departments = (deptData?.data ?? []).map((d) => ({ value: d.id, label: d.name }));

  const columns = [
    { key: 'id',            label: t('common.id',   { ns: 'common' }) },
    { key: 'name',          label: t('common.name', { ns: 'common' }) },
    { key: 'department',    label: t('nav.departments', { ns: 'common' }), render: (r) => r.department?.name ?? `#${r.department_id}` },
  ];

  const fields = [
    { name: 'name',          label: t('common.name', { ns: 'common' }) },
    { name: 'department_id', label: t('nav.departments', { ns: 'common' }), type: 'select', options: departments },
  ];

  return (
    <CrudPage
      title={t('nav.specializations', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ name: '', department_id: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default SpecializationsPage;



