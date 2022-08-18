import { runSteps } from '../lib'

export const relint = () => {
  runSteps('Relint [Caching]', [['node', ['./node_modules/eslint/bin/eslint.js', '.']]])
}
