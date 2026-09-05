import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, Modal, Spinner } from '../../../shared/components/ui';
import { useDiagnoses, useDiagnosis } from '../../visits/hooks/useDiagnoses';
import { formatDate, formatDateTime } from '../../../shared/utils/formatters';

const DetailRow = ({ label, value }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{value ?? '—'}</dd>
    </div>
);

const DiagnosisDetails = ({ diagnosisId, onClose }) => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { data: response, isLoading, isError } = useDiagnosis(diagnosisId);
    const diagnosis = response?.data ?? response;
    const appointment = diagnosis?.visit?.appointment;

    return (
        <Modal open={Boolean(diagnosisId)} onClose={onClose} title={t('diagnoses.detailsTitle', { id: diagnosisId })} size="lg">
            {isLoading && <Spinner fullScreen={false} className="mx-auto" />}
            {isError && <p className="text-sm text-red-600">{t('errors.generic', { ns: 'common' })}</p>}
            {diagnosis && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailRow label={t('diagnoses.code')} value={diagnosis.diagnosis_code} />
                        <DetailRow label={t('diagnoses.type')} value={t(`diagnoses.types.${diagnosis.diagnosis_type}`, { defaultValue: diagnosis.diagnosis_type })} />
                        <DetailRow label={t('diagnoses.visitId')} value={diagnosis.visit_id ?? diagnosis.visit?.id} />
                        <DetailRow label={t('diagnoses.visitStatus')} value={diagnosis.visit?.status ? t(`status.${diagnosis.visit.status}`, { ns: 'common', defaultValue: diagnosis.visit.status }) : null} />
                        <DetailRow label={t('appointments.scheduledDate')} value={appointment?.scheduled_date ? formatDate(appointment.scheduled_date) : null} />
                        <DetailRow label={t('diagnoses.diagnosedAt')} value={diagnosis.created_at ? formatDateTime(diagnosis.created_at) : null} />
                    </div>
                    <div className="rounded-xl border border-gray-100 px-4 py-3 dark:border-surface-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('diagnoses.description')}</p>
                        <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{diagnosis.description || '—'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 px-4 py-3 dark:border-surface-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.notes', { ns: 'common' })}</p>
                        <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{diagnosis.notes || '—'}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="secondary" onClick={onClose}>{t('actions.close', { ns: 'common' })}</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

const DiagnosesPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { data, isLoading } = useDiagnoses();
    const [selectedId, setSelectedId] = useState(null);
    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('diagnoses.title')}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('diagnoses.subtitle')}</p>
            </div>
            <Card padded={false} className="overflow-hidden">
                {isLoading ? <div className="py-16"><Spinner fullScreen={false} className="mx-auto" /></div> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-surface-800">
                            <thead className="bg-gray-50 dark:bg-surface-800/50">
                                <tr>
                                    {[t('common.id', { ns: 'common' }), t('diagnoses.code'), t('diagnoses.description'), t('diagnoses.type'), t('diagnoses.visitId'), t('common.date', { ns: 'common' }), t('common.actions', { ns: 'common' })].map((heading) => <th key={heading} className="px-5 py-3 text-start text-xs font-semibold uppercase text-gray-500">{heading}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                                {rows.map((diagnosis) => (
                                    <tr key={diagnosis.id}>
                                        <td className="px-5 py-4 text-sm" dir="ltr">{diagnosis.id}</td>
                                        <td className="px-5 py-4 text-sm" dir="ltr">{diagnosis.diagnosis_code || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-gray-800 dark:text-gray-200">{diagnosis.description || '—'}</td>
                                        <td className="px-5 py-4"><Badge status={diagnosis.diagnosis_type} /></td>
                                        <td className="px-5 py-4 text-sm" dir="ltr">{diagnosis.visit_id ?? diagnosis.visit?.id ?? '—'}</td>
                                        <td className="px-5 py-4 text-sm" dir="ltr">{formatDate(diagnosis.created_at)}</td>
                                        <td className="px-5 py-4"><Button size="sm" variant="secondary" onClick={() => setSelectedId(diagnosis.id)}>{t('actions.viewMore', { ns: 'common' })}</Button></td>
                                    </tr>
                                ))}
                                {!rows.length && <tr><td colSpan="7" className="px-5 py-10 text-center text-sm text-gray-500">{t('actions.noData', { ns: 'common' })}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
            <DiagnosisDetails diagnosisId={selectedId} onClose={() => setSelectedId(null)} />
        </div>
    );
};

export default DiagnosesPage;
