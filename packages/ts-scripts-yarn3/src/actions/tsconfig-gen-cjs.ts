import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { createBuildConfig, yarnWorkspace, yarnWorkspaces } from '../lib'

export const tsconfigGenCjs = (pkg?: string) => {
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Generate Configs [CJS]'))
  return workspaces
    .map(({ location, name }) => {
      try {
        const configObject = createBuildConfig(location, 'CommonJS', 'ES6', 'cjs')
        if (configObject) {
          const config = JSON.stringify(createBuildConfig(location, 'CommonJS', 'ES6', 'cjs'), null, 2)

          let currentConfig: string | undefined
          try {
            currentConfig = readFileSync(`${location}/.tsconfig.build.cjs.json`, { encoding: 'utf8' })
          } catch (ex) {
            currentConfig = undefined
          }
          if (currentConfig !== config) {
            console.log(chalk.gray(`Updating CJS tsconfig [${name}]`))
            writeFileSync(`${location}/.tsconfig.build.cjs.json`, config, { encoding: 'utf8' })
          }
        }
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`tsconfig (CJS) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
