import { useTranslation } from 'react-i18next';
import CrudPage from '../../../shared/components/crud/CrudPage';
import { Badge } from '../../../shared/components/ui';
import PrescriptionDetailsModal from '../components/PrescriptionDetailsModal';
import { usePrescriptions, useCreatePrescription, useUpdatePrescription, useDeletePrescription } from '../hooks/usePrescriptions';
import { useVisits } from '../../visits/hooks/useVisits';
import { formatDate } from '../../../shared/utils/formatters';
import { useRole } from '../../../core/hooks/useRole';

const PrescriptionsPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { isDoctor, isAdmin, isPharmacist } = useRole();
  const { data, isLoading } = usePrescriptions();
  const { data: visitsData } = useVisits();
  const createMut = useCreatePrescription();
  const updateMut = useUpdatePrescription();
  const deleteMut = useDeletePrescription();

  const visitsList = Array.isArray(visitsData?.data)
    ? visitsData.data
    : Array.isArray(visitsData)
      ? visitsData
      : [];

  const visitOptions = visitsList.map((visit) => ({
    value: String(visit.id),
    label: `${visit.patient?.profile?.full_name ?? `Patient #${visit.patient_id}`} — ${formatDate(visit.visited_at)}`,
  }));

  const columns = [
    { key: 'id', label: t('common.id', { ns: 'common' }) },
    {
      key: 'doctor',
      label: t('appointments.doctor'),
      render: (prescription) => prescription.visit?.doctor?.employee?.profile?.full_name
        ?? prescription.visit?.doctor?.profile?.full_name
        ?? `#${prescription.visit?.doctor_id ?? '—'}`,
    },
    { key: 'patient', label: t('appointments.patient'), render: (prescription) => prescription.visit?.patient?.profile?.full_name ?? `#${prescription.visit?.patient_id ?? '—'}` },
    { key: 'status', label: t('common.status', { ns: 'common' }), render: (r) => <Badge status={r.status} /> },
    { key: 'notes', label: t('common.notes', { ns: 'common' }) },
    { key: 'created_at', label: t('common.createdAt', { ns: 'common' }), render: (r) => formatDate(r.created_at) },
  ];

  const fields = [
   
    { name: 'visit_id', label: 'Visit', type: 'select', options: visitOptions, placeholder: 'Select visit', fullWidth: true },
   { name: 'patient_id', label: 'Patient', type: 'select', options: visitOptions, placeholder: 'Select patient', fullWidth: true },
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

  const normalizePayload = (values) => ({
    ...values,
    visit_id: Number(values.visit_id),
  });

  const canManage = isDoctor || isAdmin;

  return (
    <CrudPage
      title={t('prescriptions.title')}
      addLabel={t('prescriptions.newPrescription')}
      columns={columns}
      data={Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []}
      isLoading={isLoading}
      fields={canManage ? fields : []}
      initialValues={{ visit_id: '', status: 'pending', notes: '' }}
      onCreate={canManage ? (v) => createMut.mutateAsync(normalizePayload(v)) : undefined}
      onUpdate={canManage ? ({ id, payload }) => updateMut.mutateAsync({ id, payload: normalizePayload(payload) }) : undefined}
      onDelete={canManage ? (id) => deleteMut.mutateAsync(id) : undefined}
      isSubmitting={canManage && (createMut.isPending || updateMut.isPending)}
      renderDetailsModal={({ record, onClose }) => (
        <PrescriptionDetailsModal open onClose={onClose} prescription={record} canDispense={isPharmacist || isAdmin} />
      )}
    />
  );
};

export default PrescriptionsPage;
