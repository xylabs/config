#!/usr/bin/env node

import { runSteps } from './lib'

const rules = ['"\'import/no-cycle\': [1, { maxDepth: 6 }]"', "\"'import/no-internal-modules': ['off']\""]

console.log(rules.map((rule) => ['--rule', rule]).flat())

runSteps('Cycle', [['node', ['./node_modules/eslint/bin/eslint.js', ...rules.map((rule) => ['--rule', rule]).flat(), '--cache', '.']]])
