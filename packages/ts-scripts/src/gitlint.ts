#!/usr/bin/env node
import chalk from 'chalk'
import { sync } from 'parse-git-config'

import { safeExit } from './safeExit'

safeExit(() => {
  console.log(`\nGitlint Start [${process.cwd()}]\n`)
  let valid = 0
  let warnings = 0
  const errors = 0
  const gitConfig = sync()

  const warn = (message: string) => {
    console.warn(chalk.yellow(`Warning: ${message}`))
    warnings++
  }

  if (gitConfig.core.ignorecase) {
    warn('Please set core.ignorecase to FALSE in .git/config file [run yarn gitlint-fix]')
  } else {
    valid++
  }

  if (gitConfig.core.autocrlf !== false) {
    warn('Please set core.autocrlf to FALSE in .git/config file [run yarn gitlint-fix]')
  } else {
    valid++
  }

  if (gitConfig.core.eol !== 'lf') {
    warn('Please set core.eol to "lf" in .git/config file [run yarn gitlint-fix]')
  } else {
    valid++
  }

  const resultMessages: string[] = []
  if (valid > 0) {
    resultMessages.push(chalk.green(`Passed: ${valid}`))
  }
  if (warnings > 0) {
    resultMessages.push(chalk.yellow(`Warnings: ${warnings}`))
  }
  if (errors > 0) {
    resultMessages.push(chalk.red(` Errors: ${errors}`))
  }
  console.warn(`Gitlint Finish [ ${resultMessages.join(' | ')} ]\n`)
  return warnings + errors === 0 ? 1 : 0
})
