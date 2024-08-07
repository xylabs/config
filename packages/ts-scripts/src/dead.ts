#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Dead [${process.cwd()}]`)
  execSync('yarn dlx -q ts-prune', { stdio: 'inherit' })
})
