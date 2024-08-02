#!/usr/bin/env node

import { packageCopyAssets } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

packageCopyAssets({ target: 'cjs' })
  .then(value => (process.exitCode = value))
  .catch((reason) => {
    console.error(chalk.red(reason))
    process.exitCode = 1
  })
