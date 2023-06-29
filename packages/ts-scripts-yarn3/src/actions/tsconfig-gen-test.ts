import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { yarnWorkspace, yarnWorkspaces } from '../lib'

const tsconfigName = '.tsconfig.build.test.json'
const tsconfig = JSON.stringify(
  {
    extends: './tsconfig.json',
    include: ['src/**/*.spec.ts'],
  },
  null,
  2,
)
export const tsconfigGenTest = (pkg?: string) => {
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Generate Configs [Test]'))
  return workspaces
    .map(({ location, name }) => {
      try {
        let currentConfig: string | undefined
        try {
          currentConfig = readFileSync(`${location}/${tsconfigName}`, { encoding: 'utf8' })
        } catch (ex) {
          currentConfig = undefined
        }
        if (currentConfig !== tsconfig) {
          console.log(chalk.gray(`Updating TEST tsconfig [${name}]`))
          writeFileSync(`${location}/${tsconfigName}`, tsconfig, { encoding: 'utf8' })
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
