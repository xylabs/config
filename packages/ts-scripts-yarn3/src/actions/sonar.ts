import { runSteps } from '../lib'

export const sonar = () => {
  runSteps('Sonar', [['node', ['./node_modules/eslint/bin/eslint.js', '-c', 'sonar.eslintrc', '.']]])
}