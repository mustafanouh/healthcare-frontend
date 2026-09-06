import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFacilityManager } from '../hooks/useFacilities';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDateTime, getInitials } from '../../../shared/utils/formatters';

const DetailRow = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className={`mt-1.5 break-words text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>
            {value ?? '—'}
        </dd>
    </div>
);

const Section = ({ title, children }) => (
    <Card>
        <h2 className="mb-4 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">{title}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</dl>
    </Card>
);

const FacilityManagerPage = () => {
    const { t, i18n } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useFacilityManager(id);
    const manager = response?.data ?? response;
    const employee = manager?.employee;
    const profile = employee?.profile;
    const locale = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const languages = Array.isArray(employee?.languages) ? employee.languages.join(', ') : employee?.languages;
    const back = () => navigate('/admin/facilities');

    if (isLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;

    if (isError || !manager) {
        return (
            <div className="space-y-5">
                <Button variant="secondary" onClick={back}>{t('actions.back', { ns: 'common' })}</Button>
                <Card><p className="text-sm text-red-600 dark:text-red-400">{t('errors.generic', { ns: 'common' })}</p></Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-8">
            <Button variant="secondary" onClick={back}>{t('actions.back', { ns: 'common' })}</Button>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/25">{getInitials(profile?.full_name || manager.name)}</div>
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-200">{t('facilities.manager')}</p>
                            <h1 className="text-2xl font-bold sm:text-3xl">{profile?.full_name || manager.name || '—'}</h1>
                            <p className="mt-2 text-sm text-blue-100">{manager.email || '—'}</p>
                        </div>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${manager.is_active ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'}`}>
                        <span className={`h-2 w-2 rounded-full ${manager.is_active ? 'bg-emerald-300' : 'bg-red-300'}`} />
                        {manager.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Section title={t('facilities.managerAccount')}>
                    <DetailRow label={t('common.id', { ns: 'common' })} value={manager.id} dir="ltr" />
                    <DetailRow label={t('common.name', { ns: 'common' })} value={manager.name} />
                    <DetailRow label={t('profile.email', { ns: 'common' })} value={manager.email} dir="ltr" />
                    <DetailRow label={t('common.status', { ns: 'common' })} value={manager.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })} />
                    <DetailRow label={t('common.createdAt', { ns: 'common' })} value={formatDateTime(manager.created_at, locale)} dir="ltr" />
                    <DetailRow label={t('common.updatedAt', { ns: 'common' })} value={formatDateTime(manager.updated_at, locale)} dir="ltr" />
                </Section>
                <Section title={t('facilities.managerProfile')}>
                    <DetailRow label={t('common.id', { ns: 'common' })} value={employee?.id} dir="ltr" />
                    <DetailRow label={t('profile.nationalNumber', { ns: 'common' })} value={profile?.national_number} dir="ltr" />
                    <DetailRow label={t('common.phone', { ns: 'common' })} value={profile?.phone} dir="ltr" />
                    <DetailRow label={t('profile.gender', { ns: 'common' })} value={profile?.gender} />
                    <DetailRow label={t('common.address', { ns: 'common' })} value={profile?.address} />
                    <DetailRow label={t('employees.languages', { ns: 'common' })} value={languages} />
                </Section>
            </div>
        </div>
    );
};

export default FacilityManagerPage;