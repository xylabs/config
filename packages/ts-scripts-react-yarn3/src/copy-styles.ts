#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Copy Styles', [
  ['yarn', 'copy-styles:esm'],
  ['yarn', 'copy-styles:cjs'],
])
