import path from 'node:path'

import chalk from 'chalk'

import { deleteGlob } from '../../lib/index.ts'

export const packageCleanOutputs = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  const folders: string[] = [path.join(pkg, 'dist'), path.join(pkg, 'build'), path.join(pkg, 'docs')]
  console.log(chalk.green(`Cleaning Outputs [${pkgName}]`))

  for (let folder of folders) {
    deleteGlob(folder)
  }

  return 0
}
