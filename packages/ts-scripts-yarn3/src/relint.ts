#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Relint [Caching]', [['node', ['./node_modules/eslint/bin/eslint.js', '.']]])
