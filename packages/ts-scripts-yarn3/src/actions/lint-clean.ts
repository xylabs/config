import { runSteps } from '../lib'

export const lintClean = () => {
  return runSteps('Lint [Clean]', [
    ['yarn', ['rimraf', '.eslintcache']],
    ['yarn', ['eslint', '.', '--cache']],
  ])
}
