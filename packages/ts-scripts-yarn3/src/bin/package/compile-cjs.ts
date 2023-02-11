#!/usr/bin/env node

import chalk from 'chalk'
import { packageCompileCjs } from '../../actions'

packageCompileCjs().then((value) => process.exitCode = value).catch((reason) => {
  console.error(chalk.red(reason))
  process.exitCode = 1
})
