#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Reinstall', [
  ['yarn', 'rimraf ./yarn.lock'],
  ['yarn', 'rimraf ./node_modules'],
  ['yarn', 'yarn install --network-timeout 10000'],
])
