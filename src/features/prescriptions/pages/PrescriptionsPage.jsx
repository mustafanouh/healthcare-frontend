import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import { usePrescriptions, useCreatePrescription, useUpdatePrescription, useDeletePrescription } from '../hooks/usePrescriptions';
import { formatDate } from '../../../shared/utils/formatters';

const PrescriptionsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = usePrescriptions();
  const createMut = useCreatePrescription();
  const updateMut = useUpdatePrescription();
  const deleteMut = useDeletePrescription();

  const columns = [
    { key: 'id',         label: t('common.id',     { ns: 'common' }) },
    { key: 'visit_id',   label: 'Visit ID' },
    { key: 'status',     label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    { key: 'notes',      label: t('common.notes',  { ns: 'common' }) },
    { key: 'created_at', label: t('common.createdAt', { ns: 'common' }), render: (r) => formatDate(r.created_at) },
  ];

  const fields = [
    { name: 'visit_id', label: 'Visit ID', type: 'text', dir: 'ltr' },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: ['pending', 'dispensed', 'cancelled'].map((s) => ({
        value: s, label: t(`status.${s}`, { ns: 'common' }),
      })),
    },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
  ];

  return (
    <CrudPage
      title={t('prescriptions.title')}
      addLabel={t('prescriptions.newPrescription')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ visit_id: '', status: 'pending', notes: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default PrescriptionsPage;
