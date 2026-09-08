/**
 * Extract a user-facing message from an Axios / Laravel API error response.
 */
export const parseApiError = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (data.errors && typeof data.errors === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    return fallback;
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const parseApiFieldErrors = (error) => {
  const fieldErrors = error?.response?.data?.errors;
  if (!fieldErrors || typeof fieldErrors !== 'object') return {};

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages.filter(Boolean).join('\n') : String(messages ?? ''),
    ]).filter(([, message]) => message),
  );
};

export default parseApiError;
