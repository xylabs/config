#!/usr/bin/env node

import chalk from 'chalk'
import { packageCompile } from '@xylabs/ts-scripts-yarn3'

packageCompile({ verbose: true, publint: false })
  .then((value) => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
