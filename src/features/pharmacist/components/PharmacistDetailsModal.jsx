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

const PharmacistDetailsModal = ({ open, pharmacist, onClose }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  if (!pharmacist) return null;

  const profile = pharmacist.profile;
  const facility = pharmacist.facility;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={profile?.full_name ?? t('pharmacists.detailsTitle', { id: pharmacist.id })}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-1">
        <Section title={t('pharmacists.sections.professional')}>
          <DetailRow label={t('common.id', { ns: 'common' })} value={pharmacist.id} dir="ltr" />
          <DetailRow label={t('pharmacists.profileId')} value={pharmacist.profile_id} dir="ltr" />
          <DetailRow label={t('pharmacists.degree')} value={pharmacist.degree} />
          <DetailRow label={t('pharmacists.specialization')} value={pharmacist.specialization} />
          <DetailRow label={t('pharmacists.yearsOfExperience')} value={pharmacist.years_of_experience} dir="ltr" />
          <DetailRow label={t('pharmacists.licenseNumber')} value={pharmacist.license_number} dir="ltr" />
          <DetailRow
            label={t('common.status', { ns: 'common' })}
            value={pharmacist.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })}
          />
        </Section>

        <Section title={t('pharmacists.sections.profile')}>
          <DetailRow label={t('common.name', { ns: 'common' })} value={profile?.full_name} />
          <DetailRow label={t('pharmacists.nationalNumber')} value={profile?.national_number} dir="ltr" />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
          <DetailRow label={t('pharmacists.gender')} value={profile?.gender} />
          <DetailRow
            label={t('pharmacists.dateOfBirth')}
            value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null}
            dir="ltr"
          />
          <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
        </Section>

        <Section title={t('pharmacists.sections.facility')}>
          <DetailRow label={t('nav.facilities', { ns: 'common' })} value={facility?.name} />
          <DetailRow label={t('pharmacists.facilityType')} value={facility?.facility_type} />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={facility?.phone_number} dir="ltr" />
          <DetailRow label={t('common.address', { ns: 'common' })} value={facility?.address} />
        </Section>

        <Section title={t('pharmacists.sections.meta')}>
          <DetailRow
            label={t('common.createdAt', { ns: 'common' })}
            value={formatDateTime(pharmacist.created_at, locale)}
            dir="ltr"
          />
          <DetailRow
            label={t('common.updatedAt', { ns: 'common' })}
            value={formatDateTime(pharmacist.updated_at, locale)}
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

export default PharmacistDetailsModal;
