#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Up [${process.cwd()}]`)
  execSync('yarn outdated', { stdio: 'inherit' })
})
