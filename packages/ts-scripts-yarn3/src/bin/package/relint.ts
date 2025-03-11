#!/usr/bin/env node

import chalk from 'chalk'

import { packageLint } from '../../actions/index.ts'

packageLint(false, false, true)
  .then((value) => {
    if (value) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
