/**
 * Icon paths (Tabler-style outline) rendered in Sidebar.jsx.
 */
const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  pill: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  flask: 'M9 3h6m-1 0v6.5a4.5 4.5 0 11-4 0V3m4 0H9m0 0L5.5 18a2 2 0 002 3h9a2 2 0 002-3L14.5 9',
  building: 'M3 21h18M5 21V7l8-4v18M19 21V10l-6-3M9 9v.01M9 12v.01M9 15v.01',
  layers: 'M12 2l9 4.9-9 4.9-9-4.9L12 2zM3 12l9 4.9 9-4.9M3 17l9 4.9 9-4.9',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z',
};

/** Grouped navigation for scrollable sidebar sections. */
export const NAV_GROUPS = [
  {
    id: 'admin',
    labelKey: 'nav.groups.admin',
    items: [
      { to: '/admin/dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
      { to: '/admin/facilities', labelKey: 'nav.facilities', icon: ICONS.building },
      { to: '/admin/departments', labelKey: 'nav.departments', icon: ICONS.layers },
      { to: '/admin/specializations', labelKey: 'nav.specializations', icon: ICONS.briefcase },
      { to: '/admin/doctors', labelKey: 'nav.doctors', icon: ICONS.users },
      { to: '/admin/patients', labelKey: 'nav.patients', icon: ICONS.users },
      { to: '/admin/pharmacists', labelKey: 'nav.pharmacists', icon: ICONS.users },
      { to: '/admin/lab-staff', labelKey: 'nav.labStaff', icon: ICONS.users },
      { to: '/admin/lab-tests', labelKey: 'nav.labTests', icon: ICONS.layers },
      { to: '/admin/lab-results', labelKey: 'nav.labResults', icon: ICONS.flask },
      { to: '/admin/appointments', labelKey: 'nav.appointments', icon: ICONS.calendar },
      { to: '/admin/visits', labelKey: 'nav.visits', icon: ICONS.clipboard },
    ],
  },
  {
    id: 'doctor',
    labelKey: 'nav.groups.doctor',
    items: [
      { to: '/doctor/dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
      { to: '/doctor/appointments', labelKey: 'nav.appointments', icon: ICONS.calendar },
      { to: '/doctor/visits', labelKey: 'nav.visits', icon: ICONS.clipboard },
      { to: '/doctor/prescriptions', labelKey: 'nav.prescriptions', icon: ICONS.pill },
      { to: '/doctor/lab-requests', labelKey: 'nav.labRequests', icon: ICONS.flask },
    ],
  },
  {
    id: 'patient',
    labelKey: 'nav.groups.patient',
    items: [
      { to: '/patient/dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
      { to: '/patient/appointments', labelKey: 'nav.appointments', icon: ICONS.calendar },
      { to: '/patient/prescriptions', labelKey: 'nav.prescriptions', icon: ICONS.pill },
      { to: '/patient/lab-results', labelKey: 'nav.labResults', icon: ICONS.flask },
    ],
  },
  {
    id: 'pharmacist',
    labelKey: 'nav.groups.pharmacist',
    items: [
      { to: '/pharmacist/dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
      { to: '/pharmacist/prescriptions', labelKey: 'nav.prescriptions', icon: ICONS.pill },
      { to: '/pharmacist/dispensing', labelKey: 'nav.dispensing', icon: ICONS.clipboard },
    ],
  },
  {
    id: 'lab',
    labelKey: 'nav.groups.lab',
    items: [
      { to: '/lab/dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
      { to: '/lab/requests', labelKey: 'nav.labRequests', icon: ICONS.flask },
      { to: '/lab/results', labelKey: 'nav.labResults', icon: ICONS.clipboard },
      { to: '/lab/tests', labelKey: 'nav.labTests', icon: ICONS.layers },
    ],
  },
];

/** Flat list — kept for any legacy usage. */
export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
