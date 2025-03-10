#!/usr/bin/env node

import chalk from 'chalk'

import { packageCompileTypes } from '../../actions/index.ts'

packageCompileTypes({ verbose: true })
  .then((value) => {
    if (value) {
      process.exit(value)
    }
  })
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exit(-1)
  })
