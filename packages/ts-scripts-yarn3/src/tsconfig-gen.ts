#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Generate Configs', [
  ['yarn', 'tsconfig-gen:esm'],
  ['yarn', 'tsconfig-gen:cjs'],
  ['yarn', 'tsconfig-gen:test'],
])
