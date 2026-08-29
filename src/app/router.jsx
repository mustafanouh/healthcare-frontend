import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DashboardLayout from '../shared/components/layout/DashboardLayout';
import { NotFoundPage } from '../shared/pages/ErrorPages';
import ProtectedRoute from '../shared/components/guards/ProtectedRoute';
import GuestRoute from '../shared/components/guards/GuestRoute';

// ── Spinner while chunk loads ─────────────────────────────────────────────
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-950">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);
const wrap = (element) => <Suspense fallback={<Loader />}>{element}</Suspense>;

// ── Auth pages ────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));

// ── Role dashboards ───────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const DoctorDashboard = lazy(() => import('../features/doctor/pages/DoctorDashboard'));
const PatientDashboard = lazy(() => import('../features/patient/pages/PatientDashboard'));
const PharmacistDashboard = lazy(() => import('../features/pharmacist/pages/PharmacistDashboard'));
const LabDashboard = lazy(() => import('../features/lab/pages/LabDashboard'));

// ── Shared feature pages ──────────────────────────────────────────────────
const AppointmentsPage = lazy(() => import('../features/appointments/pages/AppointmentsPage'));
const DoctorSchedulePage = lazy(() => import('../features/doctor-schedule/pages/DoctorSchedulePage'));
const VisitsPage = lazy(() => import('../features/visits/pages/VisitsPage'));
const PrescriptionsPage = lazy(() => import('../features/prescriptions/pages/PrescriptionsPage'));
const LabResultsPage = lazy(() => import('../features/lab-results/pages/LabResultsPage'));
const DispensingPage = lazy(() => import('../features/dispensings/pages/DispensingPage'));
const ProfilePage = lazy(() => import('../shared/pages/ProfilePage'));

// ── Admin-only pages ──────────────────────────────────────────────────────
const FacilitiesPage = lazy(() => import('../features/facilities/pages/FacilitiesPage'));
const FacilityDetailsPage = lazy(() => import('../features/facilities/pages/FacilityDetailsPage'));
const FacilityStaffPage = lazy(() => import('../features/facilities/pages/FacilityStaffPage'));
const FacilityDepartmentsPage = lazy(() => import('../features/facilities/pages/FacilityDepartmentsPage'));
const DepartmentsPage = lazy(() => import('../features/facilities/pages/DepartmentsPage'));
const SpecializationsPage = lazy(() => import('../features/facilities/pages/SpecializationsPage'));
const DoctorsPage = lazy(() => import('../features/doctor/pages/DoctorsPage'));
const DoctorDetailsPage = lazy(() => import('../features/doctor/pages/DoctorDetailsPage'));
const PatientsPage = lazy(() => import('../features/patient/pages/PatientsPage'));
const PatientDetailsPage = lazy(() => import('../features/patient/pages/PatientDetailsPage'));
const MedicalConditionsPage = lazy(() => import('../features/medical-conditions/pages/MedicalConditionsPage'));
const PharmacistsPage = lazy(() => import('../features/pharmacist/pages/PharmacistsPage'));
const LabStaffPage = lazy(() => import('../features/lab/pages/LabStaffPage'));
const LabTestsPage = lazy(() => import('../features/lab-tests/pages/LabTestsPage'));
const LabRequestsPage = lazy(() => import('../features/lab/pages/LabRequestsPage'));
const AuditLogsPage = lazy(() => import('../features/admin/pages/AuditLogsPage'));
const AuditLogDetailsPage = lazy(() => import('../features/admin/pages/AuditLogDetailsPage'));
const UserRolesPage = lazy(() => import('../features/admin/pages/UserRolesPage'));

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: wrap(<LoginPage />) },
      { path: '/register', element: wrap(<RegisterPage />) },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/profile', element: wrap(<ProfilePage />) },
          { path: '/admin/dashboard', element: wrap(<AdminDashboard />) },
          { path: '/admin/facilities', element: wrap(<FacilitiesPage />) },
          { path: '/admin/facilities/:id', element: wrap(<FacilityDetailsPage />) },
          { path: '/admin/facilities/:id/staff', element: wrap(<FacilityStaffPage />) },
          { path: '/admin/facilities/:id/departments', element: wrap(<FacilityDepartmentsPage />) },
          { path: '/admin/departments', element: wrap(<DepartmentsPage />) },
          { path: '/admin/specializations', element: wrap(<SpecializationsPage />) },
          { path: '/admin/doctors', element: wrap(<DoctorsPage />) },
          { path: '/admin/doctors/:id', element: wrap(<DoctorDetailsPage />) },
          { path: '/admin/patients', element: wrap(<PatientsPage />) },
          { path: '/admin/patients/:id', element: wrap(<PatientDetailsPage />) },
          { path: '/admin/medical-conditions', element: wrap(<MedicalConditionsPage />) },
          { path: '/admin/pharmacists', element: wrap(<PharmacistsPage />) },
          { path: '/admin/lab-staff', element: wrap(<LabStaffPage />) },
          { path: '/admin/lab-tests', element: wrap(<LabTestsPage />) },
          { path: '/admin/lab-results', element: wrap(<LabResultsPage />) },
          { path: '/admin/appointments', element: wrap(<AppointmentsPage />) },
          { path: '/admin/visits', element: wrap(<VisitsPage />) },
          { path: '/admin/audit-logs', element: wrap(<AuditLogsPage />) },
          { path: '/admin/audit-logs/:id', element: wrap(<AuditLogDetailsPage />) },
          { path: '/admin/user-roles', element: wrap(<UserRolesPage />) },

          { path: '/doctor/dashboard', element: wrap(<DoctorDashboard />) },
          { path: '/doctor/schedule', element: wrap(<DoctorSchedulePage />) },
          { path: '/doctor/appointments', element: wrap(<AppointmentsPage />) },
          { path: '/doctor/visits', element: wrap(<VisitsPage />) },
          { path: '/doctor/prescriptions', element: wrap(<PrescriptionsPage />) },
          { path: '/doctor/lab-requests', element: wrap(<LabRequestsPage />) },

          { path: '/patient/dashboard', element: wrap(<PatientDashboard />) },
          { path: '/patient/appointments', element: wrap(<AppointmentsPage />) },
          { path: '/patient/prescriptions', element: wrap(<PrescriptionsPage />) },
          { path: '/patient/lab-results', element: wrap(<LabResultsPage />) },

          { path: '/pharmacist/dashboard', element: wrap(<PharmacistDashboard />) },
          { path: '/pharmacist/prescriptions', element: wrap(<PrescriptionsPage />) },
          { path: '/pharmacist/dispensing', element: wrap(<DispensingPage />) },

          { path: '/lab/dashboard', element: wrap(<LabDashboard />) },
          { path: '/lab/requests', element: wrap(<LabRequestsPage />) },
          { path: '/lab/results', element: wrap(<LabResultsPage />) },
          { path: '/lab/tests', element: wrap(<LabTestsPage />) },
        ],
      },
    ],
  },

  { path: '/', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
