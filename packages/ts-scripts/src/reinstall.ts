#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Reinstall [${process.cwd()}]`)
  execSync('yarn dlx -q rimraf ./yarn.lock', { stdio: 'inherit' })
  execSync('yarn dlx -q rimraf ./node_modules', { stdio: 'inherit' })
  execSync('yarn install --network-timeout 10000', { stdio: 'inherit' })
})
