import { runSteps } from '../lib'

export const clean = () => {
  runSteps('Clean', [['yarn', 'workspaces foreach -pA exec /dist/cjs/bin/package/clean.js']])
}
