import { runSteps } from '../lib'

export const up = () => {
  runSteps('Up', [['yarn', 'outdated']])
}
