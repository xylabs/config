#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Rebuild [${process.cwd()}]`)
  execSync('yarn clean', { stdio: 'inherit' })
  execSync('yarn build', { stdio: 'inherit' })
})
