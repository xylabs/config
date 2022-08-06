#!/usr/bin/env node

import { runSteps } from './lib'

const rules = {
  'import/no-cycle': [1, { maxDepth: 10 }],
  'import/no-internal-modules': ['off'],
}

runSteps('Cycle', [['./node_modules/eslint/bin/eslint.js', `${Object.entries(rules).map(([rule, value]) => ` --rule "${rule}: ${JSON.stringify(value)}"`)} .`]])
