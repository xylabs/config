import { rmSync } from 'fs'

import { yarnWorkspaces } from '../lib'

export const tsconfigGenClean = (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  return workspaceList
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
