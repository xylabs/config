import { runSteps } from '../lib/index.ts'

export const retest = () => {
  return runSteps('Test', [
    ['yarn', ['jest', '--clearCache']],
    ['yarn', ['jest', '.']],
  ])
}
