# good-bunyan-gcloud-formatters

[![Greenkeeper badge](https://badges.greenkeeper.io/GainCompliance/good-bunyan-gcloud-formatters.svg)](https://greenkeeper.io/)

formatters for [good-bunyan](https://github.com/muzzley/good-bunyan) to enable
[Stackdriver](https://cloud.google.com/logging/) to process
[structured](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#HttpRequest)
logs

<!-- status badges -->
[![Build Status][ci-badge]][ci-link]
[![Codecov][coverage-badge]][coverage-link]

# Inspiration

Based on the [default `good-bunyan` formatters](https://github.com/muzzley/good-bunyan#usage),
but extended to include [the proper format](https://github.com/googleapis/nodejs-logging-bunyan#formatting-request-logs)
for [Stackdriver](https://cloud.google.com/logging/)'s processing of structured
logs.

# Usage
 
<!-- consumer badges -->
[![npm][npm-badge]][npm-link]
[![MIT license][license-badge]][license-link]

Intended for use with [good-bunyan](https://github.com/muzzley/good-bunyan)
and [@google-cloud/logging-bunyan](https://github.com/googleapis/nodejs-logging-bunyan).

## Installation

```sh
$ npm install good-bunyan good-bunyan-gcloud-formatters @google-cloud/logging-bunyan --save
```

## Configuration using [good](https://github.com/hapijs/good)

```js
import hapi from 'hapi';
import bunyan from 'bunyan';
import {LoggingBunyan} from '@google-cloud/logging-bunyan';
import * as formatters from 'good-bunyan-gcloud-formatters';

const stackDriver = new LoggingBunyan({
  logName: 'flex_request_log'
});

const server = new hapi.server();

await server.register({
    plugin: require('good'),
    options: {
        ops: {interval: 1000},
        reporters: {
            bunyan: [{
                module: 'good-bunyan',
                args: [
                    {log: '*', request: '*', response: '*', error: '*'},
                    {
                        logger: bunyan.createLogger({
                            name: 'logger',
                            streams: ['production' === process.env.NODE_ENV ? stackDriver.stream('trace') : {stream: process.stdout}]
                        }),
                        levels: {
                          response: 'info',
                          request: 'info'
                        },
                        formatters
                    }
                ]
            }]
        }
    }
});

await server.start();
```

# Contributing

<!-- contribution badges -->
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![PRs Welcome][PRs-badge]][PRs-link]

## Dependencies

```sh
$ nvm install
$ npm install
```

## Verification

```sh
$ npm test
```


[npm-link]: https://www.npmjs.com/package/good-bunyan-gcloud-formatters
[npm-badge]: https://img.shields.io/npm/v/good-bunyan-gcloud-formatters.svg
[license-link]: LICENSE
[license-badge]: https://img.shields.io/github/license/GainCompliance/good-bunyan-gcloud-formatters.svg
[ci-link]: https://travis-ci.com/GainCompliance/good-bunyan-gcloud-formatters
[ci-badge]: https://img.shields.io/travis/GainCompliance/good-bunyan-gcloud-formatters.svg?branch=master
[coverage-link]: https://codecov.io/github/GainCompliance/good-bunyan-gcloud-formatters
[coverage-badge]: https://img.shields.io/codecov/c/github/GainCompliance/good-bunyan-gcloud-formatters.svg
[commit-convention-link]: https://conventionalcommits.org
[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[commitizen-link]: http://commitizen.github.io/cz-cli/
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[semantic-release-link]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[PRs-link]: http://makeapullrequest.com
[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
