import { runSteps } from '../lib'

export const sonar = () => {
  return runSteps('Sonar', [['yarn', ['eslint', '-c', 'sonar.eslintrc', '.']]])
}
