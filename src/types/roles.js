// Roles, mirrored from the `role` table in the ERD and the `user_role` pivot.
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  LAB_STAFF: 'lab_staff',
  PHARMACIST: 'pharmacist',
};

/** Normalize API role values (string or nested object) to a role slug. */
export const normalizeRole = (role) => {
  if (typeof role === 'string') return role;
  if (role && typeof role === 'object') {
    return role.name ?? role.role ?? role.slug ?? null;
  }
  return null;
};

/** All role slugs for a user, regardless of API response shape. */
export const getUserRoles = (user) =>
  (user?.roles ?? []).map(normalizeRole).filter(Boolean);

/** Primary role used for routing and nav (first entry in roles array). */
export const getPrimaryRole = (user) => getUserRoles(user)[0] ?? null;

/** Dashboard path for a user, or null when the role is missing/unknown. */
export const getRoleDashboard = (user) => {
  const role = getPrimaryRole(user);
  return role ? ROLE_DASHBOARDS[role] ?? null : null;
};

// Maps a role to the dashboard route it should land on after login.
export const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.PATIENT]: '/patient/dashboard',
  [ROLES.LAB_STAFF]: '/lab/dashboard',
  [ROLES.PHARMACIST]: '/pharmacist/dashboard',
};

// Human-readable labels (ar/en) for role badges in the UI.
export const ROLE_LABELS = {
  [ROLES.ADMIN]: { ar: 'مدير النظام', en: 'Administrator' },
  [ROLES.DOCTOR]: { ar: 'طبيب', en: 'Doctor' },
  [ROLES.PATIENT]: { ar: 'مريض', en: 'Patient' },
  [ROLES.LAB_STAFF]: { ar: 'فني مختبر', en: 'Lab staff' },
  [ROLES.PHARMACIST]: { ar: 'صيدلي', en: 'Pharmacist' },
};
