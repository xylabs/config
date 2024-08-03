#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Lint [${process.cwd()}]`)
  execSync('yarn dlx -q eslint .', { stdio: 'inherit' })
})
