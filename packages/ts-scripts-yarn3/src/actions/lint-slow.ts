import { runSteps } from '../lib'

export const lint = () => {
  runSteps('Lint [Caching]', [['node', ['./node_modules/eslint/bin/eslint.js', '.', '--cache']]])
}
