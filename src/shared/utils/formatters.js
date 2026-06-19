/**
 * Format an ISO date string for display, respecting the active locale.
 */
export const formatDate = (dateString, locale = 'ar') => {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/**
 * Format an ISO datetime string with time, respecting the active locale.
 */
export const formatDateTime = (dateString, locale = 'ar') => {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/**
 * Format a HH:mm:ss / HH:mm time string for display.
 */
export const formatTime = (timeString) => {
  if (!timeString) return '—';
  return timeString.slice(0, 5); // "14:30:00" -> "14:30"
};

/**
 * Build initials from a full name, for avatar placeholders.
 */
export const getInitials = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};
