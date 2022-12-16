import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenTest = (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  console.log(chalk.green('Generate Configs [Test]'))

  const config = JSON.stringify(
    {
      extends: './tsconfig.json',
      include: ['src/**/*.spec.ts'],
    },
    null,
    2,
  )

  return workspaceList
    .map(({ location, name }) => {
      try {
        let currentConfig: string | undefined
        try {
          currentConfig = readFileSync(`${location}/.tsconfig.build.test.json`, { encoding: 'utf8' })
        } catch (ex) {
          currentConfig = undefined
        }
        if (currentConfig !== config) {
          console.log(chalk.gray(`Updating TEST tsconfig [${name}]`))
          writeFileSync(`${location}/.tsconfig.build.test.json`, config, { encoding: 'utf8' })
        }
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`tsconfig (TEST) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
