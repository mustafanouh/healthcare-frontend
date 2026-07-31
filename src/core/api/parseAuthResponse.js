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

  const auth =
    payload.authorization ??
    payload.authorisation ??
    payload.auth ??
    {};

  const token =
    payload.token ??
    payload.access_token ??
    payload.accessToken ??
    payload.plainTextToken ??
    auth.token ??
    auth.access_token ??
    auth.accessToken ??
    null;

  const user =
    payload.user ??
    payload.authUser ??
    payload.data?.user ??
    (payload.id && payload.email ? payload : null);

  return { token, user };
};

export default parseAuthResponse;
