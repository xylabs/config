import chalk from 'chalk'
import path from 'path'
import { rimrafSync } from 'rimraf'

export const cleanESLint = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning ESLint [${pkgName}]`))

  rimrafSync(path.join(pkg, '.eslintcache'), { glob: true })

  return 0
}
