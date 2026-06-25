// All endpoints map 1:1 with the provided Postman Collection.
// {{Root}} is resolved via VITE_API_URL in axiosInstance.

export const ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
  },

  // Organization
  facilities: '/facilities',
  departments: '/departments',
  specializations: '/specialization',

  // Staff
  doctors: '/doctors',
  labStaff: '/labstaff',
  pharmacists: '/pharmacists',

  // Patients & medical data
  patients: '/patients',
  medicalConditions: '/medical-conditions',
  patientMedicalConditions: '/patient-medical-conditions',

  // Scheduling
  appointments: '/appointments',
  availableSlots: '/available-slots',
  appointmentStatus: (id) => `/appointments/${id}/status`,
  doctorSchedule: '/doctor-schedule',

  // Clinical
  visits: '/visits',
  diagnoses: '/diagnoses',

  // Pharmacy
  prescriptions: '/prescriptions',
  prescriptionItems: '/prescription-items',
  dispensings: '/dispensings',

  // Laboratory
  labTests: '/lab-tests',
  labRequestItems: '/lab-request-items',
  labResults: '/lab-results',
};
