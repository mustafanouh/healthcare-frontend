import { useAuthStore } from '../../store/authStore';

/**
 * Convenience hook exposing the authenticated user, token, and helpers.
 * Components should use this instead of importing useAuthStore directly,
 * so the underlying store implementation can change without touching the UI.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const getRole = useAuthStore((s) => s.getRole);
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    setUser,
    logout,
    role: getRole(),
    hasRole,
    hasAnyRole,
    fullName: user?.profile?.full_name ?? user?.email ?? '',
  };
};
