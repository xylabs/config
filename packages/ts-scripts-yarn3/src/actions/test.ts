import { runSteps } from '../lib/index.ts'

export const test = () => {
  return runSteps('Test', [['yarn', ['jest', '.']]])
}
