const buildLabel = (facility, department, specialization, id) => {
  const label = [facility, department, specialization].filter(Boolean).join(' · ');
  return label || (id != null ? `#${id}` : '');
};

export const buildDeptSpecLabel = (item, fdMap = {}, specMap = {}) => {
  if (!item) return '';

  const fd = item.facility_department
    ?? item.facility_department_specialization?.facility_department
    ?? (item.facility_department_id != null ? fdMap[item.facility_department_id] : null);
  const spec = item.specialization
    ?? item.facility_department_specialization?.specialization
    ?? (item.specialization_id != null ? specMap[item.specialization_id] : null);

  return buildLabel(
    fd?.facility?.name,
    fd?.department?.name,
    spec?.name,
    item.id ?? item.facility_department_specialization_id,
  );
};

export const toDeptSpecOption = (id, label) => ({
  value: String(id),
  label: label || `#${id}`,
});

export const mergeDeptSpecOptions = (...groups) => {
  const seen = new Map();
  groups.flat().forEach((opt) => {
    if (opt?.value != null && opt.value !== '' && !seen.has(opt.value)) {
      seen.set(opt.value, opt);
    }
  });
  return [...seen.values()];
};
