#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint Profile', [['./node_modules/eslint/bin/eslint.js', '.', { env: { ...process.env, TIMING: '1' } }]])
