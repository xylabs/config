import {
  closeSync, openSync, rmSync,
} from 'node:fs'

import { runSteps, yarnWorkspaces } from '../lib/index.ts'

export const reinstall = () => {
  console.log('Reinstall [Clear Lock File]')
  closeSync(openSync('./yarn.lock', 'w'))

  console.log('Reinstall [Clear Node Modules]')
  const workspaces = yarnWorkspaces()
  const result = workspaces
    .map(({ location, name }) => {
      const dist = `${location}/node_modules`
      try {
        rmSync(dist, { force: true, recursive: true })
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Reinstall [Clear Node Modules] Failed [${name}, ${error.message}]`)
        return 1
      }
    })
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((prev, result) => prev || result, 0)

  return result || runSteps('Reinstall', [['yarn', 'install --network-timeout 10000']])
}
