import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DashboardLayout from '../shared/components/layout/DashboardLayout';
import { NotFoundPage } from '../shared/pages/ErrorPages';

// ── Spinner while chunk loads ─────────────────────────────────────────────
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-950">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);
const wrap = (element) => <Suspense fallback={<Loader />}>{element}</Suspense>;

// ── Auth pages ────────────────────────────────────────────────────────────
const LoginPage    = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));

// ── Role dashboards ───────────────────────────────────────────────────────
const AdminDashboard      = lazy(() => import('../features/admin/pages/AdminDashboard'));
const DoctorDashboard     = lazy(() => import('../features/doctor/pages/DoctorDashboard'));
const PatientDashboard    = lazy(() => import('../features/patient/pages/PatientDashboard'));
const PharmacistDashboard = lazy(() => import('../features/pharmacist/pages/PharmacistDashboard'));
const LabDashboard        = lazy(() => import('../features/lab/pages/LabDashboard'));

// ── Shared feature pages ──────────────────────────────────────────────────
const AppointmentsPage    = lazy(() => import('../features/appointments/pages/AppointmentsPage'));
const VisitsPage          = lazy(() => import('../features/visits/pages/VisitsPage'));
const PrescriptionsPage   = lazy(() => import('../features/prescriptions/pages/PrescriptionsPage'));
const LabResultsPage      = lazy(() => import('../features/lab-results/pages/LabResultsPage'));
const DispensingPage      = lazy(() => import('../features/dispensings/pages/DispensingPage'));

// ── Admin-only pages ──────────────────────────────────────────────────────
const FacilitiesPage      = lazy(() => import('../features/facilities/pages/FacilitiesPage'));
const DepartmentsPage     = lazy(() => import('../features/facilities/pages/DepartmentsPage'));
const SpecializationsPage = lazy(() => import('../features/facilities/pages/SpecializationsPage'));
const DoctorsPage         = lazy(() => import('../features/doctor/pages/DoctorsPage'));
const PatientsPage        = lazy(() => import('../features/patient/pages/PatientsPage'));
const PharmacistsPage     = lazy(() => import('../features/pharmacist/pages/PharmacistsPage'));
const LabStaffPage        = lazy(() => import('../features/lab/pages/LabStaffPage'));
const LabTestsPage        = lazy(() => import('../features/lab-tests/pages/LabTestsPage'));
const LabRequestsPage     = lazy(() => import('../features/lab/pages/LabRequestsPage'));

export const router = createBrowserRouter([
  { path: '/login',    element: wrap(<LoginPage />) },
  { path: '/register', element: wrap(<RegisterPage />) },

  {
    element: <DashboardLayout />,
    children: [
      { path: '/admin/dashboard',       element: wrap(<AdminDashboard />) },
      { path: '/admin/facilities',      element: wrap(<FacilitiesPage />) },
      { path: '/admin/departments',     element: wrap(<DepartmentsPage />) },
      { path: '/admin/specializations', element: wrap(<SpecializationsPage />) },
      { path: '/admin/doctors',         element: wrap(<DoctorsPage />) },
      { path: '/admin/patients',        element: wrap(<PatientsPage />) },
      { path: '/admin/pharmacists',     element: wrap(<PharmacistsPage />) },
      { path: '/admin/lab-staff',       element: wrap(<LabStaffPage />) },
      { path: '/admin/lab-tests',       element: wrap(<LabTestsPage />) },
      { path: '/admin/appointments',    element: wrap(<AppointmentsPage />) },
      { path: '/admin/visits',          element: wrap(<VisitsPage />) },

      { path: '/doctor/dashboard',     element: wrap(<DoctorDashboard />) },
      { path: '/doctor/appointments',  element: wrap(<AppointmentsPage />) },
      { path: '/doctor/visits',        element: wrap(<VisitsPage />) },
      { path: '/doctor/prescriptions', element: wrap(<PrescriptionsPage />) },
      { path: '/doctor/lab-requests',  element: wrap(<LabRequestsPage />) },

      { path: '/patient/dashboard',     element: wrap(<PatientDashboard />) },
      { path: '/patient/appointments',  element: wrap(<AppointmentsPage />) },
      { path: '/patient/prescriptions', element: wrap(<PrescriptionsPage />) },
      { path: '/patient/lab-results',   element: wrap(<LabResultsPage />) },

      { path: '/pharmacist/dashboard',     element: wrap(<PharmacistDashboard />) },
      { path: '/pharmacist/prescriptions', element: wrap(<PrescriptionsPage />) },
      { path: '/pharmacist/dispensing',   element: wrap(<DispensingPage />) },

      { path: '/lab/dashboard', element: wrap(<LabDashboard />) },
      { path: '/lab/requests',  element: wrap(<LabRequestsPage />) },
      { path: '/lab/results',   element: wrap(<LabResultsPage />) },
      { path: '/lab/tests',     element: wrap(<LabTestsPage />) },
    ],
  },

  { path: '/',     element: <Navigate to="/admin/dashboard" replace /> },
  { path: '*',     element: <NotFoundPage /> },
]);

export default router;
