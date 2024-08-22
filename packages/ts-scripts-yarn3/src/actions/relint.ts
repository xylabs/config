import { rmSync } from 'node:fs'

import { runSteps, yarnWorkspaces } from '../lib/index.ts'

export const relint = () => {
  console.log('Relint - Cleaning [.eslintcache]')
  const workspaces = yarnWorkspaces()
  const result = workspaces
    .map(({ location, name }) => {
      const dist = `${location}/.eslintcache`
      try {
        rmSync(dist, { force: true, recursive: true })
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Relint - Cleaning [.eslintcache] Failed [${name}, ${error.message}]`)
        return 1
      }
    })
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((prev, result) => prev || result, 0)
  return result || runSteps('Relint', [['yarn', ['eslint', '.', '--cache']]])
}
