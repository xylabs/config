import path from 'node:path'

import chalk from 'chalk'

import { deleteGlob } from '../../lib/index.ts'

export const packageCleanTypescript = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))
  const files: string[] = [path.join(pkg, '*.tsbuildinfo'), path.join(pkg, '.tsconfig.*'), path.join(pkg, '.eslintcache')]

  for (let file of files) {
    deleteGlob(file)
  }

  return 0
}
