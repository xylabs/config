import path from 'node:path'

import chalk from 'chalk'
import { rimraf } from 'rimraf'

export const packageCleanOutputs = async () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  const folders: string[] = [path.join(pkg, 'dist'), path.join(pkg, 'build'), path.join(pkg, 'docs')]
  console.log(chalk.green(`Cleaning Outputs [${pkgName}]`))

  await Promise.all(folders.map(folder => rimraf(folder)))

  return 0
}
