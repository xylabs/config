#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Updo', [
  ['yarn', 'install'],
  ['yarn', 'upgrade-interactive'],
  ['yarn', 'dedupe'],
])
