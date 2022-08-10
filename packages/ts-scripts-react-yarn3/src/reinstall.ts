#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Reinstall', [
  ['node', './node_modules/rimraf/bin.js ./yarn.lock'],
  ['node', './node_modules/rimraf/bin.js ./node_modules'],
  ['yarn', 'install --network-timeout 10000'],
])
