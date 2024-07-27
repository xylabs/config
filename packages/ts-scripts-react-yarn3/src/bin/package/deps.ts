#!/usr/bin/env node

import { packageDeps } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageDeps()
  .then((value) => (process.exitCode = value))
  .catch((ex: Error) => {
    console.error(`Deps Failed: ${chalk.red(ex)}`)
    process.exitCode = 0
  })
