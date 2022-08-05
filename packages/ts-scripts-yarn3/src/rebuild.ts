#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Rebuild', [
  ['yarn', 'clean'],
  ['yarn', 'build'],
])
