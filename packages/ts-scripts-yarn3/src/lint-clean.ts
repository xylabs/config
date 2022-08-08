#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint [Clean]', [
  ['node', ['./node_modules/rimraf/bin.js', '.eslintcache']],
  ['node', ['./node_modules/eslint/bin/eslint.js', '.', '--cache']],
])
