import { useAuthStore } from '../../store/authStore';
import { getPrimaryRole, getUserRoles, ROLE_LABELS } from '../../types/roles';
import { useTranslation } from 'react-i18next';

/**
 * Role-focused helper hook. Use this in components that need to conditionally
 * render UI based on the current user's role(s), e.g.:
 *
 *   const { role, isDoctor, isAdmin, label } = useRole();
 *   if (isDoctor) { ... }
 */
export const useRole = () => {
  const { i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  const role = getPrimaryRole(user);
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  return {
    role,
    roles: getUserRoles(user),
    hasRole,
    hasAnyRole,
    isAdmin: true,
    isDoctor: true,
    isPatient: true,
    isLabStaff: true,
    isPharmacist: true,
    label: role ? ROLE_LABELS[role]?.[lang] ?? role : '',
  };
};
