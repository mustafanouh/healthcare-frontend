import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuthStore } from '../../../store/authStore';
import { parseAuthResponse } from '../../../core/api/parseAuthResponse';
import { getRoleDashboard } from '../../../types/roles';

/**
 * Handles POST /login, persists { user, token } to authStore,
 * then routes the user to their role-specific dashboard.
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { token, user } = parseAuthResponse(data);
      setAuth(user, token);

      const dashboard = getRoleDashboard(user) ?? '/admin/dashboard';
      navigate(dashboard, { replace: true });
    },
  });
};

/**
 * Handles POST /register. On success, redirects to /login so the
 * user can sign in with their new credentials.
 */
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login', { state: { registered: true } });
    },
  });
};

/**
 * Handles GET /logout. Clears local auth state regardless of the
 * API call's outcome (the token may already be invalid).
 */
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      navigate('/login', { replace: true });
    },
  });
};
