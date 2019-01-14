import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as latencyCalculation from '../../src/latency';
import {error, response} from '../../src';

suite('formatters', () => {
  let sandbox;
  const method = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(latencyCalculation, 'calculateLatencyFrom');
  });

  teardown(() => sandbox.restore());

  suite('response', () => {
    const path = any.word();

    test('that the response formatter includes `httpRequest` for stackdriver', () => {
      const instance = any.word();
      const statusCode = any.integer();
      const responseTime = any.integer();
      const referer = any.string();
      const userAgent = any.string();
      const remoteAddress = any.string();
      const httpVersion = any.string();
      const latency = any.simpleObject();
      latencyCalculation.calculateLatencyFrom.withArgs(responseTime).returns(latency);

      assert.deepEqual(
        response({
          method,
          instance,
          path,
          statusCode,
          responseTime,
          source: {referer, userAgent, remoteAddress},
          httpVersion
        }),
        [
          {
            res: {method, instance, path, statusCode, responseTime: `${responseTime}ms`},
            httpRequest: {
              requestMethod: method,
              requestUrl: path,
              status: statusCode,
              referer,
              userAgent,
              remoteIp: remoteAddress,
              protocol: httpVersion,
              latency
            }
          },
          '[response]',
          path
        ]
      );
    });

    test('that the query is added to the path for the `requestUrl` when present', () => {
      const query = any.simpleObject();
      const queryString = Object.entries(query).map(pair => pair.map(x => encodeURIComponent(x)).join('=')).join('&');
      const fullRequestPath = `${path}?${queryString}`;

      const [formatted, , message] = response({path, query, source: {}});

      assert.equal(formatted.httpRequest.requestUrl, fullRequestPath);
      assert.equal(message, fullRequestPath);
      assert.equal(formatted.res.query, queryString);
    });
  });

  test('that the error formatter includes `httpRequest` for stackdriver', () => {
    const errorMessage = any.sentence();
    const err = {...any.simpleObject(), message: errorMessage};
    const url = any.url();

    assert.deepEqual(
      error({error: err, method, url}),
      [{err, httpRequest: {requestMethod: method, requestUrl: url}}, '[error]', errorMessage]
    );
  });
});
