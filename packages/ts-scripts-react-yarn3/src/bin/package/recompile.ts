#!/usr/bin/env node

import chalk from 'chalk'
import { packageRecompile } from '@xylabs/ts-scripts-yarn3'

packageRecompile().then((value) => process.exitCode = value).catch((reason) => {
  console.error(chalk.red(reason))
  process.exitCode = 1
})