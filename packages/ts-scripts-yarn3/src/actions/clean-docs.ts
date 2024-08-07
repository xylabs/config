import path from 'node:path'

import chalk from 'chalk'
import { rimrafSync } from 'rimraf'

import { yarnWorkspaces } from '../lib/index.ts'

export const cleanDocs = () => {
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Docs [${pkgName}]`))
  for (const { location } of yarnWorkspaces()) rimrafSync(path.join(location, 'docs'), { glob: true })
  return 0
}
