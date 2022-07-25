#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'
safeExit(() => {
  console.log(`Rebuild [${process.cwd()}]`)
  execSync('yarn clean', { stdio: 'inherit' })
  execSync('yarn build', { stdio: 'inherit' })
})
