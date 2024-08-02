import { rmSync } from 'node:fs'

import { yarnWorkspaces } from '../lib/index.ts'
import { lint } from './lint.ts'

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
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((prev, result) => prev || result, 0)
  return result || lint()
}
