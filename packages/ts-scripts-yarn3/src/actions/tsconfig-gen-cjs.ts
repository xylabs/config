import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenCjs = (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  console.log(chalk.green('Generate Configs [CJS]'))

  const config = JSON.stringify(
    {
      compilerOptions: {
        module: 'CommonJS',
        outDir: './dist/cjs',
        target: 'ES6',
      },
      exclude: ['**/*.spec.*', '**/*.spec', '**/*.stories.*', '**/*.example.*'],
      extends: './tsconfig.json',
      include: ['src'],
    },
    null,
    2,
  )

  return workspaceList
    .map(({ location, name }) => {
      try {
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
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`tsconfig (CJS) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
