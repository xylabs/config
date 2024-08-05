#!/usr/bin/env node

import { runSteps } from './lib/index.ts'

runSteps('Updo', [
  ['yarn', 'install'],
  ['yarn', 'upgrade-interactive'],
  ['yarn', 'dedupe'],
])
