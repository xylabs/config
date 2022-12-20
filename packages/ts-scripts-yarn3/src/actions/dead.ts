import { runSteps } from '../lib'

export const dead = () => {
  return runSteps('Dead', [['yarn', ['ts-prune', '-p', 'tsconfig.json']]])
}
