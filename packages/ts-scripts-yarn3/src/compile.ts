#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile', [
  ['yarn', 'compile:esm'],
  ['yarn', 'compile:cjs'],
])
