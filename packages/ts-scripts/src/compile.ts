#!/usr/bin/env node
import { execSync } from 'node:child_process'

import { safeExit } from './lib'
safeExit(() => {
  console.log(`Compile [${process.cwd()}]`)
  const imageExtList = ['gif', 'png', 'svg', 'jpg', 'jpeg', 'webp']
  execSync('yarn dlx -q rimraf dist', { stdio: 'inherit' })
  execSync('yarn dlx -q rollup -c rollup.config.ts', { stdio: 'inherit' })
  execSync('yarn tsc -p tsconfig.build.json', { stdio: 'inherit' })
  for (const ext of imageExtList) {
    execSync(`yarn dlx -q copyfiles -u 1 "./src/**/*.${ext}" dist`, { stdio: 'inherit' })
  }
})
