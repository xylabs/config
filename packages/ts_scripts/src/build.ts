#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'

safeExit(() => {
  console.log(`Build [${process.cwd()}]`)
  execSync('yarn gitlint', { stdio: 'inherit' })
  execSync('yarn lint', { stdio: 'inherit' })
  execSync('yarn compile', { stdio: 'inherit' })
})
