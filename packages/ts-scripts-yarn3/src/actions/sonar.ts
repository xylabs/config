import { runSteps } from '../lib/index.ts'

export const sonar = () => {
  return runSteps('Sonar', [['yarn', ['eslint', '-c', 'sonar.eslintrc', '.']]])
}
