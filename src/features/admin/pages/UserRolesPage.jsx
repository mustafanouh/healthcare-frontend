import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, PageHeader, Spinner } from '../../../shared/components/ui';
import { useAvailableRoles, useSyncUserRoles, useUsersWithRoles } from '../hooks/useUserRoles';

const getUsers = (data) => data?.data?.users?.data ?? data?.data?.users ?? data?.users ?? [];

const getRoleNames = (user) => (
  Array.isArray(user?.roles) ? user.roles.map((role) => typeof role === 'string' ? role : role.name).filter(Boolean) : []
);

const UserRolesPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedRoles, setSelectedRoles] = useState({});
  const [notice, setNotice] = useState(null);
  const { data: usersData, isLoading, isError, error } = useUsersWithRoles({ role: roleFilter, search: search.trim() });
  const { data: rolesData, isLoading: rolesLoading } = useAvailableRoles();
  const syncRoles = useSyncUserRoles();

  const users = getUsers(usersData);
  const roles = rolesData?.data ?? {};
  const roleOptions = Array.isArray(roles)
    ? roles.map((role) => ({ id: role.id, name: role.name }))
    : Object.entries(roles).map(([id, name]) => ({ id, name }));

  useEffect(() => {
    setSelectedRoles((current) => users.reduce((next, user) => {
      if (!Object.prototype.hasOwnProperty.call(current, user.id)) next[user.id] = getRoleNames(user);
      return next;
    }, { ...current }));
  }, [usersData]);

  const toggleRole = (userId, roleName) => {
    setSelectedRoles((current) => {
      const currentRoles = current[userId] ?? [];
      const nextRoles = currentRoles.includes(roleName)
        ? currentRoles.filter((role) => role !== roleName)
        : [...currentRoles, roleName];
      return { ...current, [userId]: nextRoles };
    });
  };

  const saveRoles = async (user) => {
    setNotice(null);
    try {
      const response = await syncRoles.mutateAsync({ userId: user.id, roles: selectedRoles[user.id] ?? [] });
      setNotice({ type: 'success', message: response?.message ?? t('userRoles.saveSuccess') });
    } catch (saveError) {
      setNotice({ type: 'error', message: saveError?.response?.data?.message ?? t('errors.generic', { ns: 'common' }) });
    }
  };

  return (
    <div>
      <PageHeader title={t('userRoles.title')} subtitle={t('userRoles.subtitle')} />

      {notice && (
        <div className={`mb-5 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300'
          : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300'}`}>
          {notice.message}
        </div>
      )}

      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 p-5 dark:border-surface-800">
          <label className="block min-w-64 flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('userRoles.search')}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('userRoles.searchPlaceholder')}
              className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
            />
          </label>
          <label className="block w-48 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('userRoles.roleFilter')}
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200"
            >
              <option value="">{t('common.all', { ns: 'common' })}</option>
              {roleOptions.map((role) => (
                <option key={role.id} value={role.name}>{t(`userRoles.roleNames.${role.name}`, { defaultValue: role.name })}</option>
              ))}
            </select>
          </label>
        </div>

        {isLoading || rolesLoading ? (
          <div className="py-20"><Spinner fullScreen={false} className="mx-auto" /></div>
        ) : isError ? (
          <div className="py-20 text-center text-sm text-red-500">
            {error?.response?.data?.message ?? t('errors.generic', { ns: 'common' })}
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">{t('actions.noData', { ns: 'common' })}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 dark:bg-surface-800/50 dark:text-gray-400">
                  <th className="px-5 py-3 text-start font-medium">{t('userRoles.user')}</th>
                  <th className="px-5 py-3 text-start font-medium">{t('userRoles.roles')}</th>
                  <th className="px-5 py-3 text-end font-medium">{t('common.actions', { ns: 'common' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-surface-800">
                {users.map((user) => (
                  <tr key={user.id} className="align-top hover:bg-gray-50/60 dark:hover:bg-surface-800/30">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{user.profile?.full_name ?? user.name}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {roleOptions.map((role) => (
                          <label key={role.id} className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={(selectedRoles[user.id] ?? []).includes(role.name)}
                              onChange={() => toggleRole(user.id, role.name)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {t(`userRoles.roleNames.${role.name}`, { defaultValue: role.name })}
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <button
                        type="button"
                        onClick={() => saveRoles(user)}
                        disabled={syncRoles.isPending}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {syncRoles.isPending ? t('actions.loading', { ns: 'common' }) : t('actions.save', { ns: 'common' })}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserRolesPage;
