#!/usr/bin/env node

import { packageCompileTsup } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageCompileTsup({ verbose: true })
  .then((value) => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
