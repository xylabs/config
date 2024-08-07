#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Clean [${process.cwd()}]`)
  execSync('yarn dlx -q rimraf *.tsbuildinfo', { stdio: 'inherit' })
  execSync('yarn dlx -q rimraf ./dist', { stdio: 'inherit' })
  execSync('yarn dlx -q rimraf ./build', { stdio: 'inherit' })
})
