import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useVisit } from '../hooks/useVisits';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDate, formatDateTime, formatTime } from '../../../shared/utils/formatters';

const Detail = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400 dark:text-gray-500">{label}</dt>
        <dd className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>{value ?? '—'}</dd>
    </div>
);

const SectionTitle = ({ children }) => (
    <h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">{children}</h2>
);

const VisitDetailsPage = () => {
    const { t, i18n } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useVisit(id);
    const visit = response?.data ?? response;
    const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const backPath = window.location.pathname.startsWith('/doctor') ? '/doctor/visits' : '/admin/visits';
    const back = () => navigate(backPath);
    const patient = visit?.patient;
    const doctor = visit?.doctor;
    const appointment = visit?.appointment;

    if (isLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    if (isError || !visit) return <Card><p className="text-sm text-red-600">{t('errors.generic', { ns: 'common' })}</p><Button className="mt-4" variant="secondary" onClick={back}>{t('actions.back', { ns: 'common' })}</Button></Card>;

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-8">
            <button type="button" onClick={back} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">← {t('actions.back', { ns: 'common' })}</button>
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -end-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-blue-200">{t('visits.detailsTitle', { id })}</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{patient?.profile?.full_name ?? `#${visit.patient_id}`}</h1>
                        <p className="mt-2 text-sm text-blue-100">{formatDateTime(visit.visited_at, locale)}</p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{visit.status || '—'}</span>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <SectionTitle>{t('visits.sections.overview')}</SectionTitle>
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Detail label={t('common.id', { ns: 'common' })} value={visit.id} dir="ltr" />
                            <Detail label={t('visits.status')} value={visit.status} />
                            <Detail label={t('visits.visitedAt')} value={formatDateTime(visit.visited_at, locale)} dir="ltr" />
                            <Detail label={t('visits.appointment')} value={appointment?.id ?? visit.appointment_id} dir="ltr" />
                            <Detail label={t('visits.patient')} value={patient?.profile?.full_name ?? `#${visit.patient_id}`} />
                            <Detail label={t('visits.doctor')} value={doctor?.employee?.profile?.full_name ?? `#${visit.doctor_id}`} />
                            <Detail label={t('common.notes', { ns: 'common' })} value={visit.notes} />
                        </dl>
                    </Card>

                    <Card>
                        <SectionTitle>{t('visits.diagnoses')}</SectionTitle>
                        {visit.diagnoses?.length ? (
                            <div className="space-y-3">
                                {visit.diagnoses.map((diagnosis) => (
                                    <div key={diagnosis.id} className="rounded-xl border border-gray-100 p-4 dark:border-surface-800">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="font-medium text-gray-900 dark:text-white">{diagnosis.description}</p>
                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{diagnosis.diagnosis_type}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{diagnosis.diagnosis_code}{diagnosis.notes ? ` · ${diagnosis.notes}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500">{t('common.noData', { ns: 'common' })}</p>}
                    </Card>

                    <Card>
                        <SectionTitle>{t('visits.prescription')}</SectionTitle>
                        {visit.prescription?.items?.length ? (
                            <div className="overflow-x-auto"><table className="min-w-full text-start text-sm"><thead><tr className="border-b border-gray-100 text-gray-500 dark:border-surface-800"><th className="px-3 py-3 font-medium">{t('prescriptions.medicationName')}</th><th className="px-3 py-3 font-medium">{t('prescriptions.dosage')}</th><th className="px-3 py-3 font-medium">{t('prescriptions.quantity')}</th><th className="px-3 py-3 font-medium">{t('prescriptions.frequency')}</th><th className="px-3 py-3 font-medium">{t('prescriptions.duration')}</th></tr></thead><tbody>{visit.prescription.items.map((item) => <tr key={item.id} className="border-b border-gray-50 dark:border-surface-800/60"><td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-200">{item.medication_name}</td><td className="px-3 py-3">{item.dosage}</td><td className="px-3 py-3">{item.quantity_prescribed}</td><td className="px-3 py-3">{item.frequency}</td><td className="px-3 py-3">{item.duration}</td></tr>)}</tbody></table></div>
                        ) : <p className="text-sm text-gray-500">{t('common.noData', { ns: 'common' })}</p>}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card><SectionTitle>{t('visits.appointmentDetails')}</SectionTitle><dl className="space-y-3"><Detail label={t('visits.appointmentDate')} value={formatDate(appointment?.scheduled_date, locale)} dir="ltr" /><Detail label={t('visits.appointmentTime')} value={formatTime(appointment?.start_time)} dir="ltr" /><Detail label={t('visits.appointmentReason')} value={appointment?.reason} /></dl></Card>
                    <Card><SectionTitle>{t('visits.labRequests')}</SectionTitle>{visit.lab_request_items?.length ? <div className="space-y-3">{visit.lab_request_items.map((request) => <div key={request.id} className="rounded-xl border border-gray-100 p-3 dark:border-surface-800"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{request.lab_test?.name ?? `#${request.lab_test_id}`}</p><span className="text-xs text-gray-500">{request.status}</span></div>{request.lab_result && <p className="mt-2 text-sm text-gray-500">{request.lab_result.value} {request.lab_result.unit}</p>}</div>)}</div> : <p className="text-sm text-gray-500">{t('common.noData', { ns: 'common' })}</p>}</Card>
                    <Card><SectionTitle>{t('visits.recordDates')}</SectionTitle><dl className="space-y-3"><Detail label={t('common.createdAt', { ns: 'common' })} value={formatDateTime(visit.created_at, locale)} dir="ltr" /><Detail label={t('common.updatedAt', { ns: 'common' })} value={formatDateTime(visit.updated_at, locale)} dir="ltr" /></dl></Card>
                </div>
            </div>
        </div>
    );
};

export default VisitDetailsPage;
