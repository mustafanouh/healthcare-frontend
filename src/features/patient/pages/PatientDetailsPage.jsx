import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '../hooks/usePatients';
import PatientMedicalConditionsSection from '../components/PatientMedicalConditionsSection';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDate, formatDateTime, getInitials } from '../../../shared/utils/formatters';

const Detail = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400 dark:text-gray-500">{label}</dt>
        <dd className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>{value || '—'}</dd>
    </div>
);

const PatientDetailsPage = () => {
    const { t, i18n } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = usePatient(id);
    const patient = response?.data ?? response;
    const profile = patient?.profile;
    const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const back = () => navigate('/admin/patients');

    if (isLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    if (isError || !patient) return <Card><p className="text-sm text-red-600">{t('errors.generic', { ns: 'common' })}</p><Button className="mt-4" variant="secondary" onClick={back}>{t('actions.back', { ns: 'common' })}</Button></Card>;

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-8">
            <button type="button" onClick={back} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">← {t('actions.back', { ns: 'common' })}</button>
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -end-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/25">{getInitials(profile?.full_name)}</div>
                        <div><p className="text-xs uppercase tracking-wider text-blue-200">{t('patients.detailsTitle', { id })}</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{profile?.full_name || '—'}</h1><p className="mt-2 text-sm text-blue-100">{profile?.phone || '—'}</p></div>
                    </div>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">{t('patients.patientRecord')}</span>
                </div>
            </section>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card><h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">{t('patients.sections.profile')}</h2><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label={t('common.name', { ns: 'common' })} value={profile?.full_name} /><Detail label={t('patients.userId')} value={profile?.user_id} dir="ltr" /><Detail label={t('patients.nationalNumber')} value={profile?.national_number} dir="ltr" /><Detail label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" /><Detail label={t('patients.gender')} value={profile?.gender} /><Detail label={t('patients.dateOfBirth')} value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null} dir="ltr" /><Detail label={t('common.address', { ns: 'common' })} value={profile?.address} /></dl></Card>
                    <Card><h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">{t('patients.sections.medical')}</h2><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Detail label={t('patients.bloodType')} value={patient.blood_type} /><Detail label={t('patients.height')} value={patient.height} dir="ltr" /><Detail label={t('patients.weight')} value={patient.weight} dir="ltr" /><Detail label={t('patients.emergencyContactName')} value={patient.emergency_contact_name} /><Detail label={t('patients.emergencyContactPhone')} value={patient.emergency_contact_phone} dir="ltr" /><Detail label={t('patients.emergencyContactRelation')} value={patient.emergency_contact_relation} /></dl></Card>
                </div>
                <div className="space-y-6">
                    <PatientMedicalConditionsSection patient={patient} />
                    <Card><h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">{t('patients.sections.meta')}</h2>
                        <dl className="space-y-4"><Detail label={t('common.id', { ns: 'common' })} value={patient.id} dir="ltr" />
                            <Detail label={t('common.createdAt', { ns: 'common' })} value={formatDateTime(patient.created_at, locale)} dir="ltr" />
                            <Detail label={t('common.updatedAt', { ns: 'common' })} value={formatDateTime(patient.updated_at, locale)} dir="ltr" />
                        </dl>
                    </Card></div>
            </div>
        </div>
    );
};

export default PatientDetailsPage;
