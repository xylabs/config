import chalk from 'chalk'
import { writeFileSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenCjs = () => {
  const workspaces = yarnWorkspaces()

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

  workspaces.forEach(({ location }) => {
    writeFileSync(`${location}/.tsconfig.build.cjs.json`, config)
  })
  return 0
}
