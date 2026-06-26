import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../../../shared/components/ui';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';

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
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

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
    </Modal>
  );
};

export default PatientDetailsModal;
