import { runSteps } from '../lib'

export const dead = () => {
  runSteps('Dead', [['yarn', 'ts-prune']])
}
