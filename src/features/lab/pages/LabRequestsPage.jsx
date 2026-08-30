import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { useLabRequestItems, useCreateLabRequestItem, useUpdateLabRequestItem, useDeleteLabRequestItem } from '../../lab-results/hooks/useLabRequestItems';
import { useCreateLabResult } from '../../lab-results/hooks/useLabResults';
import { useLabTests } from '../../lab-tests/hooks/useLabTests';
import { useVisits } from '../../visits/hooks/useVisits';
import { formatDate } from '../../../shared/utils/formatters';
import AddLabResultModal from '../components/AddLabResultModal';
import { TableActionButton } from '../../../shared/components/ui';

const LabRequestsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [resultRequest, setResultRequest] = useState(null);
  const { data, isLoading } = useLabRequestItems();
  const { data: labTestsData } = useLabTests();
  const { data: visitsData } = useVisits();
  const createMut = useCreateLabRequestItem();
  const updateMut = useUpdateLabRequestItem();
  const deleteMut = useDeleteLabRequestItem();
  const createResultMut = useCreateLabResult();

  const labTestsList = Array.isArray(labTestsData?.data)
    ? labTestsData.data
    : Array.isArray(labTestsData)
      ? labTestsData
      : [];

  const visitsList = Array.isArray(visitsData?.data)
    ? visitsData.data
    : Array.isArray(visitsData)
      ? visitsData
      : [];

  const labTestOptions = labTestsList.map((test) => ({
    value: String(test.id),
    label: test.name,
  }));

  const visitOptions = visitsList.map((visit) => ({
    value: String(visit.id),
    label: `${visit.patient?.profile?.full_name ?? `Patient #${visit.patient_id}`} — ${formatDate(visit.visited_at)}`,
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    { key: 'lab_test', label: 'Lab Test', render: (r) => r.lab_test?.name ?? `#${r.lab_test_id}` },
    { key: 'requested_at', label: 'Requested', render: (r) => formatDate(r.requested_at) },
    { key: 'notes', label: t('common.notes', { ns: 'common' }) },
  ];

  const fields = [
    { name: 'visit_id', label: 'Visit', type: 'select', options: visitOptions, placeholder: 'Select visit', fullWidth: true },
    { name: 'lab_test_id', label: 'Lab Test', type: 'select', options: labTestOptions, placeholder: 'Select lab test', fullWidth: true },
    { name: 'requested_at', label: 'Requested At', type: 'datetime-local', dir: 'ltr' },
    { name: 'notes', label: t('common.notes', { ns: 'common' }), fullWidth: true },
  ];

  const normalizePayload = (values) => ({
    ...values,
    visit_id: Number(values.visit_id),
    lab_test_id: Number(values.lab_test_id),
  });

  return (
    <>
      <CrudPage
        title={t('nav.labRequests', { ns: 'common' })}
        addLabel={t('actions.add', { ns: 'common' })}
        columns={columns}
        data={Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []}
        isLoading={isLoading}
        fields={fields}
        initialValues={{ visit_id: '', lab_test_id: '', requested_at: '', notes: '' }}
        onCreate={(v) => createMut.mutateAsync(normalizePayload(v))}
        onUpdate={({ id, payload }) => updateMut.mutateAsync({ id, payload: normalizePayload(payload) })}
        onDelete={(id) => deleteMut.mutateAsync(id)}
        isSubmitting={createMut.isPending || updateMut.isPending}
        renderRowActions={(row) => (
          <TableActionButton
            variant="primary"
            label={t('labResults.addForRequest')}
            onClick={() => setResultRequest(row)}
          />
        )}
      />
      <AddLabResultModal
        open={Boolean(resultRequest)}
        requestItem={resultRequest}
        onClose={() => setResultRequest(null)}
        onSubmit={(payload) => createResultMut.mutateAsync(payload)}
        isSubmitting={createResultMut.isPending}
      />
    </>
  );
};

export default LabRequestsPage;
