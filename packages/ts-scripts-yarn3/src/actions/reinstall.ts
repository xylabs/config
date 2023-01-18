import { closeSync, openSync, rmdirSync } from 'fs'

import { runSteps } from '../lib'

export const reinstall = () => {
  console.log('Reinstall [Clear Lock File]')
  closeSync(openSync('./yarn.lock', 'w'))
  console.log('Reinstall [Clear Node Modules]')
  rmdirSync('./node_modules')
  return runSteps('Reinstall', [['yarn', 'install --network-timeout 10000']])
}
