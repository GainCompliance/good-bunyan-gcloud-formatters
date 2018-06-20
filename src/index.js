const withTag = (tag, data) => [data, `[${tag}]`];

export function error(payload) {
  return withTag(
    'error',
    {
      err: payload.error,
      httpRequest: {
        requestMethod: payload.method,
        requestUrl: payload.url,
        error: payload.error
      }
    }
  ).concat([payload.error.message]);
}
