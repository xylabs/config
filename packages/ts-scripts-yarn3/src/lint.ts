#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint', [['./node_modules/eslint/bin/eslint.js', '.']])
