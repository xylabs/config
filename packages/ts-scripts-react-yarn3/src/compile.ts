#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile', [
  ['yarn', 'compile:esm'],
  ['yarn', 'compile:cjs'],
  ['yarn', 'copy-images:esm'],
  ['yarn', 'copy-images:cjs'],
  ['yarn', 'copy-styles:esm'],
  ['yarn', 'copy-styles:cjs'],
  ['yarn', 'deps'],
])
