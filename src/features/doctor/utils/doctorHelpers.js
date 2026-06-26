export const getDoctorPlacement = (doctor) =>
  doctor?.facility_department_specialization ?? doctor?.work_configuration ?? null;

export const formatLanguagesDisplay = (languages) => {
  if (languages == null || languages === '') return '—';
  if (Array.isArray(languages)) return languages.join(', ') || '—';
  return String(languages);
};
