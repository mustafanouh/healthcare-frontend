import { useTranslation } from 'react-i18next';
import { Modal, Button, Badge } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/formatters';

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

const LabResultDetailsModal = ({ open, result, onClose }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  if (!result) return null;

  const requestItem = result.lab_request_item;
  const staff = result.lab_staff;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('labResults.detailsTitle', { id: result.id })}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-1">
        <Section title={t('labResults.sections.result')}>
          <DetailRow label={t('common.id', { ns: 'common' })} value={result.id} dir="ltr" />
          <DetailRow label={t('labResults.value')} value={`${result.value ?? '—'} ${result.unit ?? ''}`.trim()} dir="ltr" />
          <DetailRow label={t('labResults.referenceRange')} value={result.reference_range} dir="ltr" />
          <DetailRow
            label={t('common.status', { ns: 'common' })}
            value={result.status ? <Badge status={result.status} /> : '—'}
          />
          <DetailRow label={t('common.notes', { ns: 'common' })} value={result.notes} />
          <DetailRow
            label={t('labResults.completedAt')}
            value={result.completed_at ? formatDateTime(result.completed_at, locale) : null}
            dir="ltr"
          />
        </Section>

        <Section title={t('labResults.sections.request')}>
          <DetailRow label={t('labResults.labRequestItemId')} value={result.lab_request_item_id} dir="ltr" />
          <DetailRow label={t('labResults.visitId')} value={requestItem?.visit_id} dir="ltr" />
          <DetailRow label={t('labResults.labTestId')} value={requestItem?.lab_test_id} dir="ltr" />
          <DetailRow
            label={t('labResults.requestedAt')}
            value={requestItem?.requested_at ? formatDateTime(requestItem.requested_at, locale) : null}
            dir="ltr"
          />
          <DetailRow label={t('common.notes', { ns: 'common' })} value={requestItem?.notes} />
        </Section>

        <Section title={t('labResults.sections.staff')}>
          <DetailRow label={t('labResults.labStaffId')} value={result.lab_staff_id} dir="ltr" />
          <DetailRow label={t('labStaff.specialization', { defaultValue: 'Specialization' })} value={staff?.specialization} />
          <DetailRow label={t('labStaff.degree', { defaultValue: 'Degree' })} value={staff?.degree} />
          <DetailRow label={t('labStaff.licenseNumber', { defaultValue: 'License' })} value={staff?.license_number} dir="ltr" />
        </Section>

        <Section title={t('labResults.sections.meta')}>
          <DetailRow
            label={t('common.createdAt', { ns: 'common' })}
            value={formatDateTime(result.created_at, locale)}
            dir="ltr"
          />
          <DetailRow
            label={t('common.updatedAt', { ns: 'common' })}
            value={formatDateTime(result.updated_at, locale)}
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

export default LabResultDetailsModal;
