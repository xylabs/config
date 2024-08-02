import path from 'node:path'

import chalk from 'chalk'
import { rimraf } from 'rimraf'

export const packageCleanTypescript = async () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))
  const files: string[] = [path.join(pkg, '*.tsbuildinfo'), path.join(pkg, '.tsconfig.*'), path.join(pkg, '.eslintcache')]

  await Promise.all(files.map(file => rimraf(file)))

  return 0
}
