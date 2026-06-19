import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import { useLabResults, useCreateLabResult, useUpdateLabResult, useDeleteLabResult } from '../hooks/useLabResults';
import { formatDate } from '../../../shared/utils/formatters';

const LabResultsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabResults();
  const createMut = useCreateLabResult();
  const updateMut = useUpdateLabResult();
  const deleteMut = useDeleteLabResult();

  const columns = [
    { key: 'id',           label: t('common.id',     { ns: 'common' }) },
    { key: 'test',         label: t('labResults.test'), render: (r) => r.lab_request_item?.lab_test?.name ?? `#${r.lab_request_item_id}` },
    { key: 'value',        label: t('labResults.value'),     render: (r) => `${r.value} ${r.unit ?? ''}` },
    { key: 'ref',          label: t('labResults.referenceRange'), render: (r) => r.reference_range },
    { key: 'status',       label: t('common.status',  { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    { key: 'completed_at', label: t('labResults.completedAt'), render: (r) => formatDate(r.completed_at) },
  ];

  const fields = [
    { name: 'lab_request_item_id', label: 'Lab Request Item ID', type: 'text', dir: 'ltr' },
    { name: 'value',               label: t('labResults.value'),     type: 'text', dir: 'ltr' },
    { name: 'unit',                label: t('labResults.unit'),      type: 'text', dir: 'ltr' },
    { name: 'reference_range',     label: t('labResults.referenceRange'), type: 'text', dir: 'ltr' },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: ['pending', 'completed'].map((s) => ({
        value: s, label: t(`status.${s}`, { ns: 'common' }),
      })),
    },
    { name: 'notes',        label: t('common.notes',  { ns: 'common' }), fullWidth: true },
    { name: 'completed_at', label: t('labResults.completedAt'), type: 'datetime-local', dir: 'ltr' },
  ];

  return (
    <CrudPage
      title={t('labResults.title')}
      addLabel={t('labResults.newResult')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={{ lab_request_item_id: '', value: '', unit: '', reference_range: '', status: 'pending', notes: '', completed_at: '' }}
      onCreate={(v) => createMut.mutateAsync(v)}
      onUpdate={(v) => updateMut.mutateAsync(v)}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabResultsPage;
