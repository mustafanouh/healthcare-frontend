import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDoctor } from '../hooks/useDoctors';
import { getDoctorPlacement, formatLanguagesDisplay } from '../utils/doctorHelpers';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDate, formatDateTime, getInitials } from '../../../shared/utils/formatters';

const DetailRow = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className={`mt-1.5 whitespace-pre-line text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>
            {value ?? '—'}
        </dd>
    </div>
);

const Section = ({ title, children }) => (
    <Card className="border-gray-200/80 dark:border-surface-800">
        <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">
            <span className="h-5 w-1 rounded-full bg-blue-600" />
            {title}
        </h2>
        <dl>{children}</dl>
    </Card>
);

const DoctorDetailsPage = () => {
    const { t, i18n } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useDoctor(id);
    const doctor = response?.data ?? response;
    const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const placement = getDoctorPlacement(doctor);
    const profile = doctor?.profile;
    const facility = placement?.facility_department?.facility;
    const department = placement?.facility_department?.department;
    const specialization = placement?.specialization;
    const name = profile?.full_name ?? t('doctors.detailsTitle', { id });

    if (isLoading) {
        return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    }

    if (isError || !doctor) {
        return (
            <div className="space-y-5">
                <Button variant="secondary" onClick={() => navigate('/admin/doctors')}>
                    {t('actions.back', { ns: 'common' })}
                </Button>
                <Card>
                    <p className="text-sm text-red-600 dark:text-red-400">{t('errors.generic', { ns: 'common' })}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/admin/doctors')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                    <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('actions.back', { ns: 'common' })}
                </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -end-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/25 backdrop-blur-sm">
                            {getInitials(profile?.full_name)}
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-200">{t('doctors.detailsTitle', { id })}</p>
                            <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
                            <p className="mt-2 text-sm text-blue-100">
                                {specialization?.name ?? t('doctors.detailsTitle', { id })}
                            </p>
                        </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${doctor.is_active ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'}`}>
                        <span className={`h-2 w-2 rounded-full ${doctor.is_active ? 'bg-emerald-300' : 'bg-red-300'}`} />
                        {doctor.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="flex items-center gap-4 border-s-4 border-s-blue-500">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div><p className="text-xs text-gray-400">{t('doctors.yearsOfExperience')}</p><p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{doctor.years_of_experience ?? '—'}</p></div>
                </Card>
                <Card className="flex items-center gap-4 border-s-4 border-s-violet-500">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div><p className="text-xs text-gray-400">{t('nav.specializations', { ns: 'common' })}</p><p className="mt-1 truncate text-sm font-bold text-gray-900 dark:text-white">{specialization?.name || '—'}</p></div>
                </Card>
                <Card className="flex items-center gap-4 border-s-4 border-s-emerald-500">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /></svg>
                    </div>
                    <div><p className="text-xs text-gray-400">{t('nav.departments', { ns: 'common' })}</p><p className="mt-1 truncate text-sm font-bold text-gray-900 dark:text-white">{department?.name || '—'}</p></div>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Section title={t('doctors.sections.professional')}>
                    <DetailRow label={t('common.id', { ns: 'common' })} value={doctor.id} dir="ltr" />
                    <DetailRow label={t('doctors.qualification')} value={doctor.qualification} />
                    <DetailRow label={t('doctors.yearsOfExperience')} value={doctor.years_of_experience} dir="ltr" />
                    <DetailRow label={t('doctors.languages')} value={formatLanguagesDisplay(doctor.languages)} />
                    <DetailRow label={t('doctors.biography')} value={doctor.biography} />
                    <DetailRow label={t('doctors.achievements')} value={doctor.achievements} />
                    <DetailRow label={t('common.status', { ns: 'common' })} value={doctor.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })} />
                </Section>

                <Section title={t('doctors.sections.profile')}>
                    <DetailRow label={t('common.name', { ns: 'common' })} value={profile?.full_name} />
                    <DetailRow label={t('doctors.profileId')} value={doctor.profile_id} dir="ltr" />
                    <DetailRow label={t('doctors.nationalNumber')} value={profile?.national_number} dir="ltr" />
                    <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
                    <DetailRow label={t('doctors.gender')} value={profile?.gender} />
                    <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
                    <DetailRow label={t('doctors.dateOfBirth')} value={profile?.date_of_birth ? formatDate(profile.date_of_birth, locale) : null} dir="ltr" />
                </Section>

                <Section title={t('doctors.sections.placement')}>
                    <DetailRow label={t('doctors.workPlacement')} value={doctor.facility_department_specialization_id} dir="ltr" />
                    <DetailRow label={t('nav.facilities', { ns: 'common' })} value={facility?.name} />
                    <DetailRow label={t('doctors.facilityType')} value={facility?.facility_type} />
                    <DetailRow label={t('nav.departments', { ns: 'common' })} value={department?.name} />
                    <DetailRow label={t('nav.specializations', { ns: 'common' })} value={specialization?.name} />
                    <DetailRow label={t('common.address', { ns: 'common' })} value={facility?.address} />
                    <DetailRow label={t('common.phone', { ns: 'common' })} value={facility?.phone_number} dir="ltr" />
                </Section>

                <Section title={t('doctors.sections.meta')}>
                    <DetailRow label={t('common.createdAt', { ns: 'common' })} value={formatDateTime(doctor.created_at, locale)} dir="ltr" />
                    <DetailRow label={t('common.updatedAt', { ns: 'common' })} value={formatDateTime(doctor.updated_at, locale)} dir="ltr" />
                </Section>
            </div>
        </div>
    );
};

export default DoctorDetailsPage;
