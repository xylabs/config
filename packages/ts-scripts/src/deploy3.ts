#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib/index.ts'
safeExit(() => {
  console.log(`Deploy [Yarn3] [${process.cwd()}]`)
  execSync('yarn cycle', { stdio: 'inherit' })
  execSync('yarn build', { stdio: 'inherit' })
  execSync('yarn version patch -i', { stdio: 'inherit' })
  execSync('yarn npm publish', { stdio: 'inherit' })
})
