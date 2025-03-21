#!/usr/bin/env node

import { packageCompile } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageCompile({ verbose: false, publint: true })
  .then((value) => {
    if (value) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
