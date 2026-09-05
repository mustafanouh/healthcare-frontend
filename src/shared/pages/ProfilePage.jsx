import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, Spinner } from '../components/ui';
import LogoutButton from '../../features/auth/components/LogoutButton';
import authService from '../../features/auth/services/authService';
import { useAuth } from '../../core/hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../utils/formatters';

const ProfileField = ({ label, value }) => (
    <div className="border-b border-gray-100 dark:border-surface-800 pb-3 last:border-0 last:pb-0">
        <dt className="text-xs text-gray-400 dark:text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200 break-words">{value || '—'}</dd>
    </div>
);

const ProfilePage = () => {
    const { t, i18n } = useTranslation(['common', 'auth']);
    const { user: storedUser, token, fullName } = useAuth();
    const setUser = useAuthStore((state) => state.setUser);
    const { data, isLoading, isError } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authService.me,
        enabled: Boolean(token),
    });

    const user = data?.user ?? storedUser;
    const profile = user?.profile ?? {};
    const employee = profile.employee ?? {};
    const locale = i18n.language === 'ar' ? 'ar' : 'en';
    const role = user?.roles?.join(', ') || t('profile.notAvailable');
    const statusLabel = employee.is_active != null
        ? (employee.is_active ? t('profile.active') : t('profile.inactive'))
        : (user?.is_active ? t('profile.active') : t('profile.inactive'));

    useEffect(() => {
        if (data?.user) setUser(data.user);
    }, [data?.user, setUser]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('profile.subtitle')}</p>
            </div>

            {isError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                    {t('profile.loadError')}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-semibold text-white shadow-md">
                            {fullName ? fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : '?'}
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{profile.full_name || user?.name || user?.email || '—'}</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{role}</p>
                        <span className="mt-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                            {statusLabel}
                        </span>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5 dark:border-surface-800">
                        <LogoutButton />
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-surface-800">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('profile.personalDetails')}</h2>
                        {isLoading && <Spinner size="sm" />}
                    </div>
                    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        <ProfileField label={t('common.name')} value={profile.full_name || user?.name} />
                        <ProfileField label={t('profile.email')} value={user?.email} />
                        <ProfileField label={t('profile.nationalNumber')} value={profile.national_number} />
                        <ProfileField label={t('profile.phone')} value={profile.phone} />
                        <ProfileField label={t('profile.gender')} value={profile.gender ? t(`auth.register.${profile.gender}`, { defaultValue: profile.gender }) : null} />
                        <ProfileField label={t('profile.address')} value={profile.address} />
                        <ProfileField label={t('profile.dateOfBirth')} value={formatDate(profile.date_of_birth, locale)} />
                        <ProfileField label={t('profile.role')} value={role} />
                        {employee.facility && <ProfileField label={t('nav.facilities', { ns: 'common' })} value={employee.facility?.name} />}
                        {employee.languages && employee.languages.length > 0 && (
                            <ProfileField label={t('profile.languages', { defaultValue: 'Languages' })} value={Array.isArray(employee.languages) ? employee.languages.join(', ') : employee.languages} />
                        )}
                    </dl>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
