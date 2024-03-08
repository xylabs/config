import { rm } from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'

export const packageCleanOutputs = async () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  const folders: string[] = [path.join(pkg, 'dist'), path.join(pkg, 'build'), path.join(pkg, 'docs')]
  console.log(chalk.green(`Cleaning Outputs [${pkgName}]`))

  await Promise.all(folders.map((folder) => rm(folder, { force: true, recursive: true })))

  return 0
}
