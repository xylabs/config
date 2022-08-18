import { runSteps } from '../lib'

export const fix = () => {
  runSteps('Fix', [['node', ['./node_modules/eslint/bin/eslint.js', '.', '--fix', '--cache']]])
}
