#!/usr/bin/env node

import { packageRecompile } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageRecompile()
  .then((value) => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
