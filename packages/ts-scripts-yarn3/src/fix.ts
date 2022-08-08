#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Fix', [['node', ['./node_modules/eslint/bin/eslint.js', '.', '--fix', '--cache']]])
