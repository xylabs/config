import { runSteps } from '../lib'

export const lintClean = () => {
  return runSteps('Lint [Clean]', [
    ['node', ['./node_modules/rimraf/bin.js', '.eslintcache']],
    ['node', ['./node_modules/eslint/bin/eslint.js', '.', '--cache']],
  ])
}
