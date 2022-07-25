#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'
safeExit(() => {
  console.log(`Deps [${process.cwd()}]`)
  execSync('yarn dlx -q depcheck', { stdio: 'inherit' })
})
