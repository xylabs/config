#!/usr/bin/env node

import chalk from 'chalk'
import { packageDeps } from '../../actions'

packageDeps().then((value) => process.exitCode = value).catch((ex: Error) => {
  console.error(`Deps Failed: ${chalk.red(ex)}`)
  process.exitCode = 0
})
