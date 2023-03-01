import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { createBuildConfig } from '../../lib'

export const packageTsconfigGenCjs = () => {
  const pkg = process.env.INIT_CWD ?? './'
  const pkgName = process.env.npm_package_name

  try {
    const configObject = createBuildConfig(pkg, 'CommonJS', 'ES6', 'cjs')
    if (configObject) {
      const config = JSON.stringify(configObject, null, 2)

      let currentConfig: string | undefined
      try {
        currentConfig = readFileSync(`${pkg}/.tsconfig.build.cjs.json`, { encoding: 'utf8' })
      } catch (ex) {
        currentConfig = undefined
      }
      if (currentConfig !== config) {
        console.log(chalk.gray(`Updating CJS tsconfig [${pkgName}]`))
        writeFileSync(`${pkg}/.tsconfig.build.cjs.json`, config, { encoding: 'utf8' })
      }
    }
    return 0
  } catch (ex) {
    const error = ex as Error
    console.error(`tsconfig (CJS) generate failed [${pkgName}] [${error.message}]`)
    return 1
  }
}
