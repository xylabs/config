import chalk from 'chalk'
import { writeFileSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenTest = () => {
  const workspaces = yarnWorkspaces()

  console.log(chalk.green('Generate Configs [Test]'))

  const config = JSON.stringify(
    {
      extends: './tsconfig.json',
      include: ['src/**/*.spec.ts'],
    },
    null,
    2,
  )

  workspaces.forEach(({ location }) => {
    writeFileSync(`${location}/.tsconfig.build.test.json`, config)
  })
}
