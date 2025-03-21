#!/usr/bin/env node

import { packageLint } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageLint(false, false, false)
  .then(value => (process.exitCode = value))
  .catch((ex: Error) => {
    console.error(`Lint Failed: ${chalk.red(ex)}`)
    console.error(chalk.gray(ex.stack))
    process.exitCode = -1
  })
