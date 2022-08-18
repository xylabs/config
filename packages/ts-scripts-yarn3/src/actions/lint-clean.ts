import { runSteps } from '../lib'

export const lintClean = () => {
  runSteps('Lint [Clean]', [
    ['node', ['./node_modules/rimraf/bin.js', '.eslintcache']],
    ['node', ['./node_modules/eslint/bin/eslint.js', '.', '--cache']],
  ])
}
