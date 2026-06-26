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

const LabStaffDetailsModal = ({ open, member, onClose }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  if (!member) return null;

  const profile = member.profile;
  const facility = member.facility;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={profile?.full_name ?? t('labStaff.detailsTitle', { id: member.id })}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-1">
        <Section title={t('labStaff.sections.professional')}>
          <DetailRow label={t('common.id', { ns: 'common' })} value={member.id} dir="ltr" />
          <DetailRow label={t('labStaff.profileId')} value={member.profile_id} dir="ltr" />
          <DetailRow label={t('labStaff.degree')} value={member.degree} />
          <DetailRow label={t('labStaff.specialization')} value={member.specialization} />
          <DetailRow label={t('labStaff.yearsOfExperience')} value={member.years_of_experience} dir="ltr" />
          <DetailRow label={t('labStaff.licenseNumber')} value={member.license_number} dir="ltr" />
          <DetailRow
            label={t('common.status', { ns: 'common' })}
            value={member.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })}
          />
        </Section>

        <Section title={t('labStaff.sections.profile')}>
          <DetailRow label={t('common.name', { ns: 'common' })} value={profile?.full_name} />
          <DetailRow label={t('labStaff.nationalNumber')} value={profile?.national_number} dir="ltr" />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
          <DetailRow label={t('labStaff.gender')} value={profile?.gender} />
          <DetailRow
            label={t('labStaff.dateOfBirth')}
            value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null}
            dir="ltr"
          />
          <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
        </Section>

        <Section title={t('labStaff.sections.facility')}>
          <DetailRow label={t('nav.facilities', { ns: 'common' })} value={facility?.name} />
          <DetailRow label={t('labStaff.facilityType')} value={facility?.facility_type} />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={facility?.phone_number} dir="ltr" />
          <DetailRow label={t('common.address', { ns: 'common' })} value={facility?.address} />
        </Section>

        <Section title={t('labStaff.sections.meta')}>
          <DetailRow
            label={t('common.createdAt', { ns: 'common' })}
            value={formatDateTime(member.created_at, locale)}
            dir="ltr"
          />
          <DetailRow
            label={t('common.updatedAt', { ns: 'common' })}
            value={formatDateTime(member.updated_at, locale)}
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

export default LabStaffDetailsModal;
