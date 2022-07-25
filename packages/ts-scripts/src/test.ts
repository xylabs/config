#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'
safeExit(() => {
  console.log(`Test [${process.cwd()}]`)
  execSync('yarn dlx -q jest', { stdio: 'inherit' })
})
