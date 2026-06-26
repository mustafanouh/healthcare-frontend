import { useTranslation } from 'react-i18next';
import { Modal, Button } from '../../../shared/components/ui';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';
import { formatLanguagesDisplay, getDoctorPlacement } from '../utils/doctorHelpers';

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

const DoctorDetailsModal = ({ open, doctor, onClose }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  if (!doctor) return null;

  const placement = getDoctorPlacement(doctor);
  const profile = doctor.profile;
  const facility = placement?.facility_department?.facility;
  const department = placement?.facility_department?.department;
  const specialization = placement?.specialization;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={profile?.full_name ?? t('doctors.detailsTitle', { id: doctor.id })}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-1">
        <Section title={t('doctors.sections.professional')}>
          <DetailRow label={t('common.id', { ns: 'common' })} value={doctor.id} dir="ltr" />
          <DetailRow label={t('doctors.qualification')} value={doctor.qualification} />
          <DetailRow label={t('doctors.yearsOfExperience')} value={doctor.years_of_experience} dir="ltr" />
          <DetailRow label={t('doctors.languages')} value={formatLanguagesDisplay(doctor.languages)} />
          <DetailRow label={t('doctors.biography')} value={doctor.biography} />
          <DetailRow label={t('doctors.achievements')} value={doctor.achievements} />
        </Section>

        <Section title={t('doctors.sections.profile')}>
          <DetailRow label={t('common.name', { ns: 'common' })} value={profile?.full_name} />
          <DetailRow label={t('doctors.profileId')} value={doctor.profile_id} dir="ltr" />
          <DetailRow label={t('doctors.nationalNumber')} value={profile?.national_number} dir="ltr" />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
          <DetailRow label={t('doctors.gender')} value={profile?.gender} />
          <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
          <DetailRow
            label={t('doctors.dateOfBirth')}
            value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null}
            dir="ltr"
          />
        </Section>

        <Section title={t('doctors.sections.placement')}>
          <DetailRow
            label={t('doctors.workPlacement')}
            value={doctor.facility_department_specialization_id}
            dir="ltr"
          />
          <DetailRow label={t('nav.facilities', { ns: 'common' })} value={facility?.name} />
          <DetailRow label={t('doctors.facilityType')} value={facility?.facility_type} />
          <DetailRow label={t('nav.departments', { ns: 'common' })} value={department?.name} />
          <DetailRow label={t('nav.specializations', { ns: 'common' })} value={specialization?.name} />
          <DetailRow label={t('common.address', { ns: 'common' })} value={facility?.address} />
          <DetailRow label={t('common.phone', { ns: 'common' })} value={facility?.phone_number} dir="ltr" />
        </Section>

        <Section title={t('doctors.sections.meta')}>
          <DetailRow
            label={t('common.createdAt', { ns: 'common' })}
            value={formatDateTime(doctor.created_at, locale)}
            dir="ltr"
          />
          <DetailRow
            label={t('common.updatedAt', { ns: 'common' })}
            value={formatDateTime(doctor.updated_at, locale)}
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

export default DoctorDetailsModal;
