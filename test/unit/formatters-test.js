import {assert} from 'chai';
import any from '@travi/any';
import {error} from '../../src';

suite('formatters', () => {
  test('that the error formatter includes `httpRequest` for stackdriver', () => {
    const errorMessage = any.sentence();
    const err = {...any.simpleObject(), message: errorMessage};
    const method = any.word();
    const url = any.url();

    assert.deepEqual(
      error({error: err, method, url}),
      [{err, httpRequest: {error: err, requestMethod: method, requestUrl: url}}, '[error]', errorMessage]
    );
  });
});
