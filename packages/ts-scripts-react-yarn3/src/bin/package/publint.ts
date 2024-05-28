#!/usr/bin/env node

import chalk from 'chalk'
import { packagePublint } from '@xylabs/ts-scripts-yarn3'

packagePublint()
  .then((value) => (process.exitCode = value))
  .catch((ex: Error) => {
    console.error(`Publint Failed: ${chalk.red(ex)}`)
    console.error(chalk.gray(ex.stack))
    process.exitCode = -1
  })
