#!/usr/bin/env node

import { packagePublint } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packagePublint()
  .then((value) => (process.exitCode = value))
  .catch((ex: Error) => {
    console.error(`Publint Failed: ${chalk.red(ex)}`)
    console.error(chalk.gray(ex.stack))
    process.exitCode = -1
  })
