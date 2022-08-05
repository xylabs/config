#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Up [${process.cwd()}]`)
  execSync('yarn outdated', { stdio: 'inherit' })
})
