import chalk from 'chalk'
import path from 'path'
import { rimrafSync } from 'rimraf'

export const packageCleanTypescript = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))

  const buildInfo = path.join(pkg, '*.tsbuildinfo')
  console.log(chalk.gray(`rimraf [${buildInfo}]`))
  rimrafSync(buildInfo)

  const tsConfig = path.join(pkg, '.tsconfig.*')
  console.log(chalk.gray(`rimraf [${tsConfig}]`))
  rimrafSync(tsConfig)

  return 0
}
