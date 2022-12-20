import { runSteps } from '../lib'

export const test = () => {
  return runSteps('Test', [['yarn', ['jest', '.']]])
}
