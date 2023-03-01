import { runSteps } from '../lib'

export const retest = () => {
  return runSteps('Test', [
    ['yarn', ['jest', '--clearCache']],
    ['yarn', ['jest', '.']],
  ])
}
