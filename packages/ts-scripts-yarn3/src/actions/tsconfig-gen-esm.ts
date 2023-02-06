import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { createBuildConfig, yarnWorkspaces } from '../lib'

export const tsconfigGenEsm = (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  console.log(chalk.green('Generate Configs [ESM]'))

  return workspaceList
    .map(({ location, name }) => {
      try {
        const config = JSON.stringify(createBuildConfig(location, 'ESNext', 'ESNext', 'esm'), null, 2)
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
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`tsconfig (ESM) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
