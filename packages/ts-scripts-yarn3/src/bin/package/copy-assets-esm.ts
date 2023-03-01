#!/usr/bin/env node

import chalk from 'chalk'
import { packageCopyAssets } from '../../actions'

packageCopyAssets({target: 'esm'}).then((value) => process.exitCode = value).catch((reason) => {
  console.error(chalk.red(reason))
  process.exitCode = 1
})