#!/usr/bin/env node

import chalk from 'chalk'

import { packageCompileTsup } from '../../actions/index.ts'

packageCompileTsup()
  .then(value => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
