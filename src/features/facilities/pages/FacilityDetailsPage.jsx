import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFacility } from '../hooks/useFacilities';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/formatters';

const Detail = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>{value || '—'}</dd>
    </div>
);

const FacilityDetailsPage = () => {
    const { t } = useTranslation(['dashboard', 'common']);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useFacility(id);
    const facility = response?.data ?? response;
    const back = () => navigate('/admin/facilities');

    if (isLoading) return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    if (isError || !facility) return <Card><p className="text-sm text-red-600">{t('errors.generic', { ns: 'common' })}</p><Button className="mt-4" variant="secondary" onClick={back}>{t('actions.back', { ns: 'common' })}</Button></Card>;

    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-8">
            <button type="button" onClick={back} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">← {t('actions.back', { ns: 'common' })}</button>
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -end-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div><p className="text-xs uppercase tracking-wider text-blue-200">{t('facilities.facilityType')}</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{facility.name}</h1><p className="mt-2 text-sm text-blue-100">{facility.address || '—'}</p></div>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">{facility.is_active ? t('status.active', { ns: 'common' }) : t('status.inactive', { ns: 'common' })}</span>
                </div>
            </section>
            <Card>
                <h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">{t('facilities.details')}</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Detail label={t('common.id', { ns: 'common' })} value={facility.id} dir="ltr" />
                    <Detail label={t('facilities.facilityType')} value={facility.facility_type} />
                    <Detail label={t('common.phone', { ns: 'common' })} value={facility.phone_number} dir="ltr" />
                    <Detail label={t('common.address', { ns: 'common' })} value={facility.address} />
                    <Detail label={t('facilities.parentFacility')} value={facility.parent_id} dir="ltr" />
                    <Detail label={t('common.createdAt', { ns: 'common' })} value={formatDateTime(facility.created_at, t('language.ar', { ns: 'common' }) === 'العربية' ? 'ar' : 'en')} dir="ltr" />
                    <Detail label={t('common.updatedAt', { ns: 'common' })} value={formatDateTime(facility.updated_at)} dir="ltr" />
                </dl>
            </Card>
        </div>
    );
};

export default FacilityDetailsPage;
