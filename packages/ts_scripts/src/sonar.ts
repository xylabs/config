#!/usr/bin/env node
import { execSync } from 'child_process'

import { safeExit } from './safeExit'
safeExit(() => {
  console.log(`Sonar [${process.cwd()}]`)
  execSync('yarn dlx -q eslint -c sonar.eslintrc .', { stdio: 'inherit' })
})
