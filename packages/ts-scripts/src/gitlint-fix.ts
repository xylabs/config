#!/usr/bin/env node
import { execSync } from 'node:child_process'

import chalk from 'chalk'
import { sync } from 'parse-git-config'

import { safeExit } from './lib/index.ts'

safeExit(() => {
  console.log(`\nGitlint Fix Start [${process.cwd()}]\n`)

  const gitConfig = sync()

  if (gitConfig.core.ignorecase) {
    execSync('git config core.ignorecase false', { stdio: 'inherit' })
    console.warn(chalk.yellow('\nGitlint Fix: Updated core.ignorecase to be false\n'))
  }

  if (gitConfig.core.autocrlf !== false) {
    execSync('git config core.autocrlf false', { stdio: 'inherit' })
    console.warn(chalk.yellow('\nGitlint Fix: Updated core.autocrlf to be false\n'))
  }

  if (gitConfig.core.eol !== 'lf') {
    execSync('git config core.eol lf', { stdio: 'inherit' })
    console.warn(chalk.yellow('\nGitlint Fix: Updated core.eol to be "lf"\n'))
  }

  return 1
})
