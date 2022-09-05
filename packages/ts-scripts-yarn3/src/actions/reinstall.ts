import { closeSync, openSync } from 'fs'

import { runSteps } from '../lib'

export const reinstall = () => {
  console.log('Reinstall [Clear Lock File]')
  closeSync(openSync('./yarn.lock', 'w'))
  return runSteps('Reinstall', [
    ['node', './node_modules/rimraf/bin.js ./node_modules'],
    ['yarn', 'install --network-timeout 10000'],
  ])
}
