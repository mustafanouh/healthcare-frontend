import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPrimaryRole } from '../types/roles';

/**
 * Auth store — persisted to localStorage.
 *
 * Expected shape of `user` returned from POST /login or /register:
 * {
 *   id: number,
 *   email: string,
 *   is_active: boolean,
 *   roles: ['doctor'],            // array of role names (user_role -> role)
 *   profile: {
 *     full_name, national_number, phone, gender, address, date_of_birth
 *   }
 * }
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called after a successful login/register response
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      // Update only the user profile (e.g. after editing profile info)
      setUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // Primary role = first entry in the roles array
      getRole: () => getPrimaryRole(get().user),

      // Role checks disabled — always allow
      hasRole: () => true,
      hasAnyRole: () => true,
    }),
    {
      name: 'healthcare-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
