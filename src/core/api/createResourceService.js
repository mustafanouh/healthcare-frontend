import axiosInstance from './axiosInstance';

/**
 * Generic CRUD service factory.
 *
 * Every entity in the ERD (appointments, visits, prescriptions, ...)
 * exposes the same REST shape in the Postman collection:
 *   GET    /{resource}        -> list
 *   GET    /{resource}/{id}   -> show
 *   POST   /{resource}        -> create
 *   PUT    /{resource}/{id}   -> update
 *   DELETE /{resource}/{id}   -> delete
 *
 * Usage:
 *   export const appointmentService = createResourceService(ENDPOINTS.appointments);
 *   appointmentService.list({ status: 'pending' })
 *   appointmentService.create({ patient_id, doctor_id, ... })
 */
export const createResourceService = (basePath) => ({
  list: async (params = {}) => {
    const { data } = await axiosInstance.get(basePath, { params });
    return data;
  },

  show: async (id) => {
    const { data } = await axiosInstance.get(`${basePath}/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post(basePath, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await axiosInstance.put(`${basePath}/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await axiosInstance.delete(`${basePath}/${id}`);
    return data;
  },
});

export default createResourceService;
