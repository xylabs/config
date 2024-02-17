#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Up [${process.cwd()}]`)
  execSync('yarn dlx -q ncu', { stdio: 'inherit' })
})
