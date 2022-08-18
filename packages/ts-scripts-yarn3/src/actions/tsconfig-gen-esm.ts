import chalk from 'chalk'
import { writeFileSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenEsm = () => {
  const workspaces = yarnWorkspaces()

  console.log(chalk.green('Generate Configs [ESM]'))

  const config = JSON.stringify(
    {
      compilerOptions: {
        module: 'ES2022',
        outDir: './dist/esm',
        target: 'ES2022',
      },
      exclude: ['**/*.spec.*', '**/*.stories.*', '**/*.example.*'],
      extends: './tsconfig.json',
      include: ['src'],
    },
    null,
    2,
  )

  workspaces.forEach(({ location }) => {
    writeFileSync(`${location}/.tsconfig.build.esm.json`, config)
  })
}
