import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { createBuildConfig, yarnWorkspace, yarnWorkspaces } from '../lib'

export const tsconfigGenEsm = (pkg?: string) => {
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Generate Configs [ESM]'))
  return workspaces
    .map(({ location, name }) => {
      try {
        const configObject = createBuildConfig(location, 'ESNext', 'ESNext', 'esm')
        if (configObject) {
          const config = JSON.stringify(configObject, null, 2)
          let currentConfig: string | undefined
          try {
            currentConfig = readFileSync(`${location}/.tsconfig.build.esm.json`, { encoding: 'utf8' })
          } catch (ex) {
            currentConfig = undefined
          }
          if (currentConfig !== config) {
            console.log(chalk.gray(`Updating ESM tsconfig [${name}]`))
            writeFileSync(`${location}/.tsconfig.build.esm.json`, config, { encoding: 'utf8' })
          }
        }
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`tsconfig (ESM) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
