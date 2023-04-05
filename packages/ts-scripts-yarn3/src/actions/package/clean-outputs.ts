import chalk from 'chalk'
import { rmSync } from 'fs'
import path from 'path'

export const packageCleanOutputs = () => {
  const pkg = process.env.INIT_CWD ?? '.'
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning Outputs [${pkgName}]`))

  const dist = path.join(pkg, 'dist')
  rmSync(dist, { force: true, recursive: true })

  const build = path.join(pkg, 'build')
  rmSync(build, { force: true, recursive: true })
  return 0
}
