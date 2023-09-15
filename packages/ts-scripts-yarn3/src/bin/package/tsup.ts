#!/usr/bin/env node

import chalk from 'chalk'
import { packageTsup } from '../../actions'

packageTsup().then((value) => process.exitCode = value).catch((ex: Error) => {
  console.error(`Tsup Failed: ${chalk.red(ex)}`)
  process.exitCode = -1
})
