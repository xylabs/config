import chalk from 'chalk'
import { rmSync } from 'fs'

export const packageClean = () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning [${pkgName}]`))

  const dist = `${pkg}/dist`
  rmSync(dist, { force: true, recursive: true })
}
