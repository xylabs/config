import chalk from 'chalk'
import path from 'path'
import { rimrafSync } from 'rimraf'

export const packageCleanTypescript = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Typescript [${pkgName}]`))

  const buildInfo = path.join(pkg, '*.tsbuildinfo')
  rimrafSync(buildInfo, { glob: true })

  const tsConfig = path.join(pkg, '.tsconfig.*')
  rimrafSync(tsConfig, { glob: true })

  return 0
}
