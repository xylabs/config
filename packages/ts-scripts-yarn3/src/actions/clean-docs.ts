import path from 'node:path'

import chalk from 'chalk'

import {
  deleteGlob, yarnWorkspaces,
} from '../lib/index.ts'

export const cleanDocs = () => {
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Docs [${pkgName}]`))
  for (const { location } of yarnWorkspaces()) deleteGlob(path.join(location, 'docs'))
  return 0
}
