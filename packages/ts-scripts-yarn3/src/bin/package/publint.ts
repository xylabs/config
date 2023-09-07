#!/usr/bin/env node

import chalk from 'chalk'
import { packagePublint } from '../../actions'

packagePublint().then((value) => process.exitCode = value).catch((ex: Error) => {
  console.error(`Publint Failed: ${chalk.red(ex)}`)
  process.exitCode = 0
})
