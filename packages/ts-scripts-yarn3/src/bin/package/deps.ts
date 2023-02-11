#!/usr/bin/env node

import chalk from 'chalk'
import { packageDeps } from '../../actions'

packageDeps().then((value) => process.exitCode = value).catch((reason) => {
  console.error(chalk.red(reason))
  process.exitCode = 1
})
