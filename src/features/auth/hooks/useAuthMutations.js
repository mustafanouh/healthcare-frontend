import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    mutationFn: async (credentials) => {
      const data = await authService.login(credentials);
      const { token, user } = parseAuthResponse(data);

      if (!token || !user) {
        throw new Error('Invalid login response');
      }

      return { token, user };
    },
    onSuccess: ({ token, user }) => {
      setAuth(user, token);

      const dashboard = getRoleDashboard(user) ?? '/admin/dashboard';
      navigate(dashboard, { replace: true });
    },
  });
};

/**
 * Handles POST /register. The API returns an access token and user,
 * so the newly created patient can continue directly to their dashboard.
 */
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload) => {
      const data = await authService.register(payload);
      const { token, user } = parseAuthResponse(data);

      if (!token || !user) {
        throw new Error('Registration succeeded but no authenticated user was returned');
      }

      return { token, user };
    },
    onSuccess: ({ token, user }) => {
      setAuth(user, token);
      navigate('/patient/dashboard', { replace: true });
    },
  });
};

/**
 * Handles POST /logout. Clears local auth state regardless of the
 * API call's outcome (the token may already be invalid).
 */
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().token;

      if (!token) {
        throw new Error('Missing auth token');
      }

      return authService.logout(token);
    },
    onSettled: () => {
      queryClient.clear();
      logout();
      navigate('/login', { replace: true });
    },
  });
};
