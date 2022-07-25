#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'
safeExit(() => {
  console.log(`Up [${process.cwd()}]`)
  execSync('yarn outdated', { stdio: 'inherit' })
})
