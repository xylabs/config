import { runSteps } from '../lib/index.ts'

export const fix = () => {
  return runSteps('Fix', [['yarn', ['eslint', '.', '--fix', '--cache']]])
}
