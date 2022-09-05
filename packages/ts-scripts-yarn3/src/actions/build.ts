import { runSteps } from '../lib'

export const build = (target?: 'esm' | 'cjs') => {
  runSteps('Build', [
    ['yarn', target ? `compile:${target}` : 'compile'],
    ['yarn', 'lint'],
  ])
}
