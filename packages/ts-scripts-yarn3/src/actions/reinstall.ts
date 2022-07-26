import { closeSync, openSync } from 'fs'

import { runSteps } from '../lib'

export const reinstall = () => {
  console.log('Reinstall [Clear Lock File]')
  closeSync(openSync('./yarn.lock', 'w'))
  return runSteps('Reinstall', [
    ['yarn', 'xy rimraf ./node_modules'],
    ['yarn', 'install --network-timeout 10000'],
  ])
}
