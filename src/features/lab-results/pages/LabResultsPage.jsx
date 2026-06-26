import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import LabResultDetailsModal from '../components/LabResultDetailsModal';
import { useLabResults, useCreateLabResult, useUpdateLabResult, useDeleteLabResult } from '../hooks/useLabResults';
import { useLabRequestItems } from '../hooks/useLabRequestItems';
import { useLabStaffList } from '../../lab/hooks/useLabStaff';
import { formatDate } from '../../../shared/utils/formatters';

const STATUS_OPTIONS = ['pending', 'processing', 'completed'];

const EMPTY_VALUES = {
  lab_request_item_id: '',
  lab_staff_id: '',
  value: '',
  notes: '',
  status: 'pending',
  unit: '',
  reference_range: '',
  completed_at: '',
};

const formatCreatePayload = (values) => ({
  lab_request_item_id: Number(values.lab_request_item_id),
  lab_staff_id: Number(values.lab_staff_id),
  value: Number(values.value),
  notes: values.notes,
});

const formatUpdatePayload = (values) => ({
  lab_request_item_id: Number(values.lab_request_item_id),
  lab_staff_id: Number(values.lab_staff_id),
  notes: values.notes,
  status: values.status,
  value: values.value !== '' ? Number(values.value) : undefined,
  unit: values.unit || undefined,
  reference_range: values.reference_range || undefined,
  completed_at: values.completed_at
    ? values.completed_at.replace('T', ' ').slice(0, 19)
    : undefined,
});

const mapRecordToForm = (record) => ({
  lab_request_item_id: record.lab_request_item_id ?? '',
  lab_staff_id: record.lab_staff_id ?? '',
  value: record.value ?? '',
  notes: record.notes ?? '',
  status: record.status ?? 'pending',
  unit: record.unit ?? '',
  reference_range: record.reference_range ?? '',
  completed_at: record.completed_at
    ? String(record.completed_at).replace(' ', 'T').slice(0, 16)
    : '',
});

const LabResultsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data, isLoading } = useLabResults();
  const { data: requestItemsData } = useLabRequestItems();
  const { data: labStaffData } = useLabStaffList();
  const createMut = useCreateLabResult();
  const updateMut = useUpdateLabResult();
  const deleteMut = useDeleteLabResult();

  const requestItemOptions = useMemo(
    () => (requestItemsData?.data ?? []).map((item) => ({
      value: item.id,
      label: `#${item.id} · ${t('labResults.visitId')} ${item.visit_id} · ${t('labResults.labTestId')} ${item.lab_test_id}`,
    })),
    [requestItemsData, t],
  );

  const labStaffOptions = useMemo(
    () => (labStaffData?.data ?? []).map((s) => ({
      value: s.id,
      label: `${s.profile?.full_name ?? t('labResults.labStaffId')} #${s.id}`,
    })),
    [labStaffData, t],
  );

  const statusOptions = STATUS_OPTIONS.map((s) => ({
    value: s,
    label: t(`status.${s}`, { ns: 'common' }),
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'request',
      label: t('labResults.labRequestItemId'),
      render: (r) => `#${r.lab_request_item_id}`,
      dir: 'ltr',
    },
    {
      key: 'value',
      label: t('labResults.value'),
      render: (r) => (r.value != null ? `${r.value} ${r.unit ?? ''}`.trim() : '—'),
      dir: 'ltr',
    },
    {
      key: 'reference_range',
      label: t('labResults.referenceRange'),
      cellVariant: 'badge',
    },
    {
      key: 'status',
      label: t('common.status', { ns: 'common' }),
      render: (r) => <Badge status={r.status} />,
    },
    {
      key: 'lab_staff',
      label: t('labResults.labStaffId'),
      render: (r) => r.lab_staff?.specialization ?? `#${r.lab_staff_id}`,
    },
    {
      key: 'completed_at',
      label: t('labResults.completedAt'),
      render: (r) => (r.completed_at ? formatDate(r.completed_at) : '—'),
      dir: 'ltr',
    },
  ];

  const fields = [
    {
      name: 'lab_request_item_id',
      label: t('labResults.labRequestItemId'),
      type: 'select',
      options: requestItemOptions,
      fullWidth: true,
    },
    {
      name: 'lab_staff_id',
      label: t('labResults.labStaffId'),
      type: 'select',
      options: labStaffOptions,
      fullWidth: true,
    },
    { name: 'value', label: t('labResults.value'), type: 'number', dir: 'ltr' },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
    {
      name: 'status',
      label: t('common.status', { ns: 'common' }),
      type: 'select',
      options: statusOptions,
      editOnly: true,
    },
    { name: 'unit', label: t('labResults.unit'), dir: 'ltr', editOnly: true },
    { name: 'reference_range', label: t('labResults.referenceRange'), dir: 'ltr', editOnly: true },
    { name: 'completed_at', label: t('labResults.completedAt'), type: 'datetime-local', dir: 'ltr', editOnly: true },
  ];

  return (
    <CrudPage
      title={t('labResults.title')}
      subtitle={t('labResults.pageSubtitle')}
      addLabel={t('labResults.newResult')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      fields={fields}
      initialValues={EMPTY_VALUES}
      mapRecordToForm={mapRecordToForm}
      renderDetailsModal={({ record, onClose }) => (
        <LabResultDetailsModal open onClose={onClose} result={record} />
      )}
      onCreate={(v) => createMut.mutateAsync(formatCreatePayload(v))}
      onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: formatUpdatePayload(payload) })}
      onDelete={(id) => deleteMut.mutateAsync(id)}
      isSubmitting={createMut.isPending || updateMut.isPending}
    />
  );
};

export default LabResultsPage;
