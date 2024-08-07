#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Deps [${process.cwd()}]`)
  execSync('yarn dlx -q depcheck', { stdio: 'inherit' })
})
