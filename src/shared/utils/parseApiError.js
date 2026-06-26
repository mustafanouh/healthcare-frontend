/**
 * Extract a user-facing message from an Axios / Laravel API error response.
 */
export const parseApiError = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length) return messages.join('\n');
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  return fallback;
};

export default parseApiError;
