import chalk from 'chalk'
import { rimrafSync } from 'rimraf'

export const packageCleanTypescript = () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))

  rimrafSync(`${pkg}/*.tsbuildinfo`)
  rimrafSync(`${pkg}/.tsconfig.*`)

  return 0
}
