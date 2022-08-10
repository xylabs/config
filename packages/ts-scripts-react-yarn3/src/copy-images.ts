#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Copy Images', [
  ['yarn', 'copy-images:esm'],
  ['yarn', 'copy-images:cjs'],
])
