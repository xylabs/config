#!/usr/bin/env node

import { packageCompile } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageCompile({ verbose: true, publint: false })
  .then(value => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
