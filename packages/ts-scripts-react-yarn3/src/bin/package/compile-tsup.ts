#!/usr/bin/env node

import chalk from 'chalk'
import { packageCompileTsup } from '@xylabs/ts-scripts-yarn3'

packageCompileTsup({ verbose: true })
  .then((value) => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
