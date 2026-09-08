// All endpoints map 1:1 with the provided Postman Collection.
// {{Root}} is resolved via VITE_API_URL in axiosInstance.

export const ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me',
  },

  // Organization
  facilities: '/facilities',
  facilityStaff: (id) => `/facilities/${id}/staff`,
  facilityManager: (id) => `/facilities/${id}/manager`,
  departments: '/departments',
  specializations: '/specialization',
  facilityDepartments: '/facility-departments',
  facilityDeptSpecs: '/facility-dept-specs',

  // Employees (new system)
  employees: '/employees',
  employeeSoftDelete: (id) => `/employees/${id}/soft-delete`,

  // Staff (using employee_id)
  doctors: '/doctors',
  labStaff: '/labstaff',
  pharmacists: '/pharmacists',
  pharmacistDashboard: '/dashboard',

  // Patients & medical data
  patients: '/patients',
  medicalConditions: '/medical-conditions',
  medicalConditionsUpdate: '/medical_conditions',
  patientMedicalConditions: '/patient-medical-conditions',
   patientMedicalConditionsByPatient: (patientId) => `/patient-medical-conditions/patient/${patientId}`,

  // Scheduling
  appointments: '/appointments',
  availableSlots: '/available-slots',
  appointmentStatus: (id) => `/appointments/${id}/status`,
  appointmentStartVisit: (id) => `/appointments/${id}/start-visit`,
  doctorSchedule: '/doctor-schedule',

  // Clinical
  visits: '/visits',
  visitComplete: (id) => `/visits/${id}/complete`,
  visitStatus: (id) => `/visits/${id}/status`,
  diagnoses: '/diagnoses',

  // Pharmacy
  prescriptions: '/prescriptions',
  prescriptionItems: '/prescription-items',
  prescriptionItemsByPrescription: (id) => `/prescriptions/${id}/items`,
  dispensings: '/dispensings',

  // Laboratory
  labTests: '/lab-tests',
  labRequestItems: '/lab-request-items',
  labRequestItemStart: (id) => `/lab-request-items/${id}/start`,
  labResults: '/lab-results',

  // Administration
  auditLogs: '/audit-logs',
  roles: '/roles',
  availableRoles: '/get-roles',
  syncUserRoles: (id) => `/roles/sync-role/${id}`,
};
