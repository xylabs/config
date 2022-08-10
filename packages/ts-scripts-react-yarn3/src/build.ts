#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Build', [
  ['yarn', 'version patch --deferred'],
  ['yarn', 'build-ci'],
])
