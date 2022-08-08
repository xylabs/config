#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint [Clean]', [
  ['./node_modules/rimraf/bin.js', '.eslintcache'],
  ['./node_modules/eslint/bin/eslint.js', ['.', '--cache']],
])
