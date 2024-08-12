import path from 'node:path'

import chalk from 'chalk'

import { deleteGlob } from '../lib/index.ts'

export const cleanESLint = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning ESLint [${pkgName}]`))

  deleteGlob(path.join(pkg, '.eslintcache'))

  return 0
}
