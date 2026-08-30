import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Spinner } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/formatters';
import { useFacilityDeptSpecs } from '../hooks/useFacilityDeptSpecs';
import { useDepartment } from '../hooks/useDepartments';

const Detail = ({ label, value, dir }) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/40">
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className={`mt-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 ${dir === 'ltr' ? 'dir-ltr text-start' : ''}`}>
            {value ?? '—'}
        </dd>
    </div>
);

const DepartmentDetailsPage = () => {
    const { t } = useTranslation('common');
    const { facilityId, departmentId } = useParams();
    const navigate = useNavigate();
    const { data: departmentResponse, isLoading: isDepartmentLoading } = useDepartment(departmentId);
    const { data: deptSpecResponse, isLoading: isSpecsLoading } = useFacilityDeptSpecs();

    const department = departmentResponse?.data ?? departmentResponse ?? null;
    const deptSpecs = Array.isArray(deptSpecResponse?.data)
        ? deptSpecResponse.data
        : Array.isArray(deptSpecResponse)
            ? deptSpecResponse
            : [];

    const relatedSpecializations = deptSpecs.filter((item) => {
        const itemDepartmentId = item?.facility_department_id ?? item?.facility_department?.id ?? item?.department_id ?? item?.department?.id;
        return itemDepartmentId === Number(departmentId);
    }).map((item) => ({
        id: item?.specialization_id ?? item?.specialization?.id ?? item?.id,
        name: item?.specialization?.name ?? item?.name ?? `#${item?.specialization_id ?? item?.id ?? 'unknown'}`,
        description: item?.specialization?.description ?? item?.description ?? null,
        is_active: item?.specialization?.is_active ?? item?.is_active ?? true,
        created_at: item?.specialization?.created_at ?? item?.created_at ?? null,
        updated_at: item?.specialization?.updated_at ?? item?.updated_at ?? null,
    }));

    const back = () => navigate(`/admin/facilities/${facilityId}/departments`);

    if (isDepartmentLoading || isSpecsLoading) {
        return <Spinner fullScreen={false} className="mx-auto mt-20" />;
    }

    if (!department) {
        return (
            <Card>
                <p className="text-sm text-red-600">{t('errors.generic')}</p>
                <Button className="mt-4" variant="secondary" onClick={back}>{t('actions.back')}</Button>
            </Card>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-8">
            <button type="button" onClick={back} className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400">← {t('actions.back')}</button>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-700 p-6 text-white shadow-lg sm:p-8">
                <div className="absolute -end-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-blue-200">{t('nav.departments')}</p>
                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{department.name}</h1>
                        <p className="mt-2 text-sm text-blue-100">{department.description || '—'}</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                        {department.is_active ? t('status.active') : t('status.inactive')}
                    </span>
                </div>
            </section>

            <Card>
                <h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">
                    {t('common.description')}
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Detail label={t('common.id')} value={department.id} dir="ltr" />
                    <Detail label={t('common.name')} value={department.name} />
                    <Detail label={t('common.description')} value={department.description} />
                    <Detail label={t('common.status')} value={department.is_active ? t('status.active') : t('status.inactive')} />
                    <Detail label={t('common.createdAt')} value={formatDateTime(department.created_at)} dir="ltr" />
                    <Detail label={t('common.updatedAt')} value={formatDateTime(department.updated_at)} dir="ltr" />
                </dl>
            </Card>

            <Card>
                <h2 className="mb-5 border-b border-gray-100 pb-4 text-base font-semibold text-gray-900 dark:border-surface-800 dark:text-white">
                    {t('nav.specializations')}
                </h2>

                {relatedSpecializations.length ? (
                    <div className="space-y-3">
                        {relatedSpecializations.map((specialization) => (
                            <div key={specialization.id ?? `${department.id}-${specialization.name}`} className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-blue-900 dark:text-blue-200">{specialization.name}</p>
                                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{specialization.description || '—'}</p>
                                    </div>
                                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-surface-900 dark:text-blue-200">
                                        {specialization.is_active ? t('status.active') : t('status.inactive')}
                                    </span>
                                </div>
                                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                                    <span>{t('common.createdAt')}: {formatDateTime(specialization.created_at)}</span>
                                    <span>{t('common.updatedAt')}: {formatDateTime(specialization.updated_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('actions.noData')}</p>
                )}
            </Card>
        </div>
    );
};

export default DepartmentDetailsPage;
