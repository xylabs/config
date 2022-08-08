#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint [Caching]', [['./node_modules/eslint/bin/eslint.js', ['.', '--cache']]])
