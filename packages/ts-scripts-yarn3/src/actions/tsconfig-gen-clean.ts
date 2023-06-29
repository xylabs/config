import chalk from 'chalk'
import { rmSync } from 'fs'

import { yarnWorkspace, yarnWorkspaces } from '../lib'

export const tsconfigGenClean = (pkg?: string) => {
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Clean TSConfigs'))
  return workspaces
    .map(({ location, name }) => {
      const dist = `${location}/**/.tsconfig*`
      try {
        rmSync(dist, { force: true, recursive: true })
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Clean Failed [${name}, ${error.message}]`)
        return 1
      }
    })
    .reduce((prev, result) => prev || result, 0)
}
