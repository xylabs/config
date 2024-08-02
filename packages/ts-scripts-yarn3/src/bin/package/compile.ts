#!/usr/bin/env node

import chalk from 'chalk'

import { packageCompile } from '../../actions/index.ts'

packageCompile({ verbose: false })
  .then((value) => {
    if (value) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
