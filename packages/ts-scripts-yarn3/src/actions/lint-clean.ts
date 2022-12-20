import { runSteps } from '../lib'

export const lintClean = () => {
  return runSteps('Lint [Clean]', [
    ['yarn', ['xy', 'rimraf', '.eslintcache']],
    ['yarn', ['eslint', '.', '--cache']],
  ])
}
