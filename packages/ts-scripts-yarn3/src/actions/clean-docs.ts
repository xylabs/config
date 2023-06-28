import chalk from 'chalk'
import path from 'path'
import { rimrafSync } from 'rimraf'

export const cleanDocs = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Docs [${pkgName}]`))

  rimrafSync(path.join(pkg, '**/docs'), { glob: true })

  return 0
}
