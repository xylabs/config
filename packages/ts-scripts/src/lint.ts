#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Lint [${process.cwd()}]`)
  execSync('yarn dlx -q eslint .', { stdio: 'inherit' })
})
