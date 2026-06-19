import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useLabRequestItems, useCreateLabRequestItem, useUpdateLabRequestItem, useDeleteLabRequestItem } from '../../lab-results/hooks/useLabRequestItems';
import { formatDate } from '../../../shared/utils/formatters';

const LabRequestsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabRequestItems();
  const createMut = useCreateLabRequestItem();
  const updateMut = useUpdateLabRequestItem();
  const deleteMut = useDeleteLabRequestItem();

  const columns = [
    { key: 'id',          label: t('common.id',   { ns: 'common' }) },
    { key: 'lab_test',    label: 'Lab Test', render: (r) => r.lab_test?.name ?? `#${r.lab_test_id}` },
    { key: 'requested_at', label: 'Requested', render: (r) => formatDate(r.requested_at) },
    { key: 'notes',       label: t('common.notes', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'visit_id',     label: 'Visit ID',    type: 'text', dir: 'ltr' },
    { name: 'lab_test_id',  label: 'Lab Test ID', type: 'text', dir: 'ltr' },
    { name: 'requested_at', label: 'Requested At', type: 'datetime-local', dir: 'ltr' },
    { name: 'notes',        label: t('common.notes', { ns: 'common' }), fullWidth: true },
  ];

  return (
    <CrudPage
      title={t('nav.labRequests', { ns: 'common' })}
      addLabel={t('actions.add', { ns: 'common' })}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ visit_id: '', lab_test_id: '', requested_at: '', notes: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabRequestsPage;
