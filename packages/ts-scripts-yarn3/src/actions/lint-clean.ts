import { rimrafSync } from 'rimraf'

import { runSteps } from '../lib'

export const lintClean = () => {
  console.log('Clean [.eslintcache]')
  rimrafSync('.eslintcache')
  return runSteps('Lint [Clean]', [['yarn', ['eslint', '.', '--cache']]])
}
