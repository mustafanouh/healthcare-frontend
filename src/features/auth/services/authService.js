import axiosInstance from '../../../core/api/axiosInstance';
import { ENDPOINTS } from '../../../core/api/endpoints';

export const authService = {
  /**
   * POST /login
   * Body: { email, password }
   * Response: { token, user: { id, email, roles: [...], profile: {...} } }
   */
  login: async (credentials) => {
    const { data } = await axiosInstance.post(ENDPOINTS.auth.login, credentials);
    return data;
  },

  /**
   * POST /register
   * Body: { name, email, password, password_confirmation,
   *         national_number, phone, gender, address, date_of_birth }
   */
  register: async (payload) => {
    const { data } = await axiosInstance.post(ENDPOINTS.auth.register, payload);
    return data;
  },

  /**
   * GET /logout
   */
  logout: async () => {
    const { data } = await axiosInstance.get(ENDPOINTS.auth.logout);
    return data;
  },
};

export default authService;
