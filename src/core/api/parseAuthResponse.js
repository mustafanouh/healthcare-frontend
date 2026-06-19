/**
 * Normalize login/register API payloads across common Laravel/Sanctum shapes.
 */
export const parseAuthResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { token: null, user: null };
  }

  const payload =
    data.data && typeof data.data === 'object' && !Array.isArray(data.data)
      ? data.data
      : data;

  const token =
    payload.token ??
    payload.access_token ??
    payload.accessToken ??
    payload.plainTextToken ??
    null;

  const user =
    payload.user ??
    (payload.id && payload.email ? payload : null);

  return { token, user };
};

export default parseAuthResponse;
