import chalk from 'chalk'
import path from 'path'
import { rimrafSync } from 'rimraf'

export const packageCleanTypescript = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))

  rimrafSync(path.join(pkg, '*.tsbuildinfo'))
  rimrafSync(path.join(pkg, '.tsconfig.*'))

  return 0
}
