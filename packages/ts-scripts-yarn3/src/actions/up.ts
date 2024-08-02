import { runSteps } from '../lib/index.ts'

export const up = () => {
  return runSteps('Up', [['yarn', 'outdated']])
}
