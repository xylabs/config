import { closeSync, openSync, rmSync } from 'fs'

import { runSteps } from '../lib'

export const reinstall = () => {
  console.log('Reinstall [Clear Lock File]')
  closeSync(openSync('./yarn.lock', 'w'))
  console.log('Reinstall [Clear Node Modules]')
  const build = './node_modules'
  rmSync(build, { force: true, recursive: true })
  return runSteps('Reinstall', [['yarn', 'install --network-timeout 10000']])
}
