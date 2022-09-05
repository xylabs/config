import { runSteps } from '../lib'

export const up = () => {
  return runSteps('Up', [['yarn', 'outdated']])
}
