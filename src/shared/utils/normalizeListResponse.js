/**
 * Normalize API list responses — supports:
 *   { success, data: [...] }
 *   { success, data: { data: [...], total, current_page, ... } }  (Laravel pagination)
 */
export const normalizeListResponse = (body) => {
  const inner = body?.data;

  if (inner?.data && Array.isArray(inner.data)) {
    return {
      ...body,
      data: inner.data,
      total: inner.total,
      meta: inner,
    };
  }

  return body;
};

export default normalizeListResponse;
