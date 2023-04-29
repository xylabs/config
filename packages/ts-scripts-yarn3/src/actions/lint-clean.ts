import { rmSync } from 'fs'

import { yarnWorkspaces } from '../lib'
import { lint } from './lint'

export const lintClean = () => {
  console.log('Lint Clean [.eslintcache]')
  const workspaces = yarnWorkspaces()
  const result = workspaces
    .map(({ location, name }) => {
      const dist = `${location}/.eslintcache`
      try {
        rmSync(dist, { force: true, recursive: true })
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Lint Clean [.eslintcache] Failed [${name}, ${error.message}]`)
        return 1
      }
    })
    .reduce((prev, result) => prev || result, 0)
  return result || lint()
}
