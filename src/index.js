import querystring from 'querystring';
import {calculateLatencyFrom} from './latency';

const withTag = (tag, data) => [data, `[${tag}]`];

export function response({method, instance, path, query, statusCode, responseTime, source, httpVersion}) {
  const queryString = querystring.stringify(query);
  const requestUrl = `${path}${queryString ? `?${queryString}` : ''}`;

  return withTag(
    'response',
    {
      res: {
        instance,
        method,
        path,
        statusCode,
        responseTime: `${responseTime}ms`,
        ...queryString && {query: queryString}
      },
      httpRequest: {
        requestMethod: method,
        requestUrl,
        status: statusCode,
        referer: source.referer,
        userAgent: source.userAgent,
        remoteIp: source.remoteAddress,
        protocol: httpVersion,
        latency: calculateLatencyFrom(responseTime)
      }
    }
  ).concat([requestUrl]);
}

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
