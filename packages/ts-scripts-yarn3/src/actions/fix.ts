import { runSteps } from '../lib'

export const fix = () => {
  return runSteps('Fix', [['yarn', ['eslint', '.', '--fix', '--cache']]])
}
