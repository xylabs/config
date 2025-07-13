#!/usr/bin/env node

import { packageCompile } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageCompile()
  .then((value) => {
    if (value > 0) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
