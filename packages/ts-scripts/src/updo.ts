#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Updo [${process.cwd()}]`)
  execSync('yarn install', { stdio: 'inherit' })
  execSync('yarn upgrade', { stdio: 'inherit' })
  execSync('yarn dlx -q ncu -u', { stdio: 'inherit' })
  execSync('yarn reinstall', { stdio: 'inherit' })
})
