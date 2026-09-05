import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPrimaryRole, getUserRoles } from '../types/roles';

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
 *     id: number,
 *     full_name, national_number, phone, gender, address, date_of_birth,
 *     employee: {
 *       id: number,
 *       facility_id: number,
 *       languages: array,
 *       is_active: boolean,
 *       doctor: { ... },        // if user is a doctor
 *       pharmacist: { ... },    // if user is a pharmacist
 *       labStaff: { ... }       // if user is lab staff
 *     }
 *   }
 * }
 *
 * NOTE: Data access patterns changed from profile.doctor to profile.employee.doctor
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called after a successful login/register response
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: Boolean(user && token),
        }),

      // Update only the user profile (e.g. after editing profile info)
      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });

        // Ensure a stale persisted token cannot restore the session on redirect/reload.
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('healthcare-auth');
        }
      },

      // Primary role = first entry in the roles array
      getRole: () => getPrimaryRole(get().user),

      hasRole: (role) => getUserRoles(get().user).includes(role),
      hasAnyRole: (roles) => roles.some((role) => getUserRoles(get().user).includes(role)),
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
