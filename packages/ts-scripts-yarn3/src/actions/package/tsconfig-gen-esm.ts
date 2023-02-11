import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { createBuildConfig } from '../../lib'

export const packageTsconfigGenEsm = () => {
  const pkg = process.env.INIT_CWD ?? './'
  const pkgName = process.env.npm_package_name

  try {
    const configObject = createBuildConfig(pkg, 'ESNext', 'ESNext', 'esm')
    if (configObject) {
      const config = JSON.stringify(configObject, null, 2)

      let currentConfig: string | undefined
      try {
        currentConfig = readFileSync(`${pkg}/.tsconfig.build.esm.json`, { encoding: 'utf8' })
      } catch (ex) {
        currentConfig = undefined
      }
      if (currentConfig !== config) {
        console.log(chalk.gray(`Updating ESM tsconfig [${pkgName}]`))
        writeFileSync(`${pkg}/.tsconfig.build.esm.json`, config, { encoding: 'utf8' })
      }
    }
    return 0
  } catch (ex) {
    const error = ex as Error
    console.error(`tsconfig (ESM) generate failed [${pkgName}] [${error.message}]`)
    return 1
  }
}
