#!/usr/bin/env node

import chalk from 'chalk'
import { packageCopyAssets } from '@xylabs/ts-scripts-yarn3'

packageCopyAssets({target: 'esm'}).then((value) => process.exitCode = value).catch((reason) => {
  console.error(chalk.red(reason))
  process.exitCode = 1
})