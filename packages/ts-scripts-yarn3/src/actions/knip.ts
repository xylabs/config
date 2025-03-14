import { runSteps } from '../lib/index.ts'

export const knip = () => {
  return runSteps('Knip', [['yarn', ['knip', '--dependencies']]])
}
