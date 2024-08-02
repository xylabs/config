import { runSteps } from '../lib/index.ts'

export const dead = () => {
  return runSteps('Dead', [['yarn', ['ts-prune', '-p', 'tsconfig.json']]])
}
