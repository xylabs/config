#!/usr/bin/env node

import chalk from 'chalk'

import { packageCycle } from '../../actions/index.ts'

packageCycle()
  .then((value) => {
    if (value > 0) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
