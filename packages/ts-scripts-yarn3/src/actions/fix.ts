import { runSteps } from '../lib'

export const fix = () => {
  return runSteps('Fix', [['node', ['./node_modules/eslint/bin/eslint.js', '.', '--fix', '--cache']]])
}
