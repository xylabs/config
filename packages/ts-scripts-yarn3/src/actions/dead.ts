import { runSteps } from '../lib'

export const dead = () => {
  return runSteps('Dead', [['node', ['./node_modules/ts-prune/lib/index.js', '-p', 'tsconfig.json']]])
}
