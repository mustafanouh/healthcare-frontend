import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../../../shared/components/ui';
import ResourceFormModal from '../../../shared/components/crud/ResourceFormModal';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';
import { useMedicalConditions } from '../../medical-conditions/hooks/useMedicalConditions';
import {
  usePatientMedicalConditions,
  useCreatePatientMedicalCondition,
  useUpdatePatientMedicalCondition,
  useDeletePatientMedicalCondition,
} from '../hooks/usePatientMedicalConditions';

const DetailRow = ({ label, value, dir }) => (
  <div className="py-2.5 border-b border-gray-100 dark:border-surface-800 last:border-0">
    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</dt>
    <dd className={`text-sm text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>
      {value ?? '—'}
    </dd>
  </div>
);

const Section = ({ title, children }) => (
  <section>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <dl>{children}</dl>
  </section>
);

const PatientDetailsModal = ({ open, patient, onClose }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const [conditionFormOpen, setConditionFormOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const { data: conditionResponse, isLoading: conditionsLoading } = usePatientMedicalConditions(patient?.id, { enabled: open });
  const { data: availableResponse } = useMedicalConditions({}, { enabled: open });
  const createCondition = useCreatePatientMedicalCondition();
  const updateCondition = useUpdatePatientMedicalCondition();
  const deleteCondition = useDeletePatientMedicalCondition();
  const patientConditions = conditionResponse?.data ?? [];
  const availableConditions = availableResponse?.data ?? [];
  const conditionFields = [
    {
      name: 'medical_condition_id',
      label: t('patients.condition'),
      type: 'select',
      options: availableConditions.map((condition) => ({ value: condition.id, label: condition.name })),
    },
    { name: 'diagnosed_at', label: t('patients.diagnosedAt'), type: 'date', dir: 'ltr' },
    { name: 'notes', label: t('medicalConditions.notes', { ns: 'dashboard' }), fullWidth: true },
  ];

  const openConditionForm = (condition = null) => {
    setEditingCondition(condition);
    setConditionFormOpen(true);
  };

  const saveCondition = async (values) => {
    const payload = {
      patient_id: patient.id,
      medical_condition_id: Number(values.medical_condition_id),
      notes: values.notes || null,
      diagnosed_at: values.diagnosed_at,
    };
    if (editingCondition) {
      await updateCondition.mutateAsync({ id: editingCondition.id, payload });
    } else {
      await createCondition.mutateAsync(payload);
    }
    setConditionFormOpen(false);
    setEditingCondition(null);
  };

  if (!patient) return null;

  const profile = patient.profile;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={profile?.full_name ?? t('patients.detailsTitle', { id: patient.id })}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-1">
        <Section title={t('patients.sections.profile')}>
          <DetailRow label={t('common.id', { ns: 'common' })} value={patient.id} dir="ltr" />
          <DetailRow label={t('patients.userId')} value={profile?.user_id} dir="ltr" />
          <DetailRow label={t('common.name', { ns: 'common' })} value={profile?.full_name} />
          <DetailRow label={t('patients.nationalNumber')} value={profile?.national_number} dir="ltr" />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
          <DetailRow label={t('patients.gender')} value={profile?.gender} />
          <DetailRow
            label={t('patients.dateOfBirth')}
            value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null}
            dir="ltr"
          />
          <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
        </Section>

        <Section title={t('patients.sections.medical')}>
          <DetailRow label={t('patients.bloodType')} value={patient.blood_type} />
          <DetailRow label={t('patients.height')} value={patient.height} dir="ltr" />
          <DetailRow label={t('patients.weight')} value={patient.weight} dir="ltr" />
          <DetailRow label={t('patients.allergies')} value={patient.allergies} />
          <DetailRow label={t('patients.chronicDiseases')} value={patient.chronic_diseases} />
          <DetailRow label={t('patients.medicalHistory')} value={patient.medical_history} />
        </Section>

        <Section title={t('patients.sections.emergency')}>
          <DetailRow label={t('patients.emergencyContactName')} value={patient.emergency_contact_name} />
          <DetailRow label={t('patients.emergencyContactPhone')} value={patient.emergency_contact_phone} dir="ltr" />
          <DetailRow label={t('patients.emergencyContactRelation')} value={patient.emergency_contact_relation} />
        </Section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('patients.sections.conditions')}</h3>
            <Button size="sm" onClick={() => openConditionForm()}>
              + {t('actions.add', { ns: 'common' })}
            </Button>
          </div>
          {conditionsLoading ? (
            <p className="py-4 text-sm text-gray-400">{t('actions.loading', { ns: 'common' })}</p>
          ) : patientConditions.length === 0 ? (
            <p className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-400 dark:bg-surface-800">{t('actions.noData', { ns: 'common' })}</p>
          ) : (
            <div className="space-y-2">
              {patientConditions.map((condition) => (
                <div key={condition.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3 dark:border-surface-800">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{condition.medical_condition?.name || `#${condition.medical_condition_id}`}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {condition.medical_condition?.type ? t(`medicalConditions.${condition.medical_condition.type}`, { ns: 'dashboard', defaultValue: condition.medical_condition.type }) : ''}
                      {condition.diagnosed_at ? ` · ${formatDate(condition.diagnosed_at, locale)}` : ''}
                    </p>
                    {condition.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{condition.notes}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openConditionForm(condition)}>{t('actions.edit', { ns: 'common' })}</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteCondition.mutate(condition.id)}>{t('actions.delete', { ns: 'common' })}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Section title={t('patients.sections.meta')}>
          <DetailRow
            label={t('common.createdAt', { ns: 'common' })}
            value={formatDateTime(patient.created_at, locale)}
            dir="ltr"
          />
          <DetailRow
            label={t('common.updatedAt', { ns: 'common' })}
            value={formatDateTime(patient.updated_at, locale)}
            dir="ltr"
          />
        </Section>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-surface-800">
        <Button variant="secondary" onClick={onClose}>
          {t('actions.close', { ns: 'common' })}
        </Button>
      </div>

      <ResourceFormModal
        open={conditionFormOpen}
        onClose={() => { setConditionFormOpen(false); setEditingCondition(null); }}
        title={editingCondition ? t('actions.edit', { ns: 'common' }) : t('patients.addCondition')}
        fields={conditionFields}
        initialValues={{ medical_condition_id: '', diagnosed_at: '', notes: '' }}
        record={editingCondition ? {
          medical_condition_id: editingCondition.medical_condition_id,
          diagnosed_at: editingCondition.diagnosed_at?.slice(0, 10) || '',
          notes: editingCondition.notes || '',
        } : null}
        onSubmit={saveCondition}
        isSubmitting={createCondition.isPending || updateCondition.isPending}
      />
    </Modal>
  );
};

export default PatientDetailsModal;
