#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Cycle [${process.cwd()}]`)
  const rules = {
    'import/no-cycle': [1, { maxDepth: 10 }],
    'import/no-internal-modules': ['off'],
  }

  const rulesCli = Object.entries(rules).map(([rule, value]) => ` --rule "${rule}: ${JSON.stringify(value)}"`)
  const eslintCli = `yarn dlx -q eslint ${rulesCli} .`

  execSync(eslintCli, {
    stdio: 'inherit',
  })
})
