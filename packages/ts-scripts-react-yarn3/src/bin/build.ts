#!/usr/bin/env node

import { runSteps } from '@xylabs/ts-scripts-yarn3'

runSteps('Build', [
  ['yarn', 'version patch --deferred'],
  ['yarn', 'build-ci'],
])
