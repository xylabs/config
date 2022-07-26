import chalk from 'chalk'
import { rmSync } from 'fs'

import { runSteps } from '../../lib'

export const packageClean = () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name
  console.log(chalk.green(`Cleaning [${pkgName}]`))

  const dist = `${pkg}/dist`
  rmSync(dist, { force: true, recursive: true })

  return (
    runSteps('Package Clean [ESM]', [['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`, '--clean']]]) &&
    runSteps('Package Clean [CJS]', [['tsc', ['--build', `${pkg}/.tsconfig.build.cjs.json`, '--clean']]])
  )
}
