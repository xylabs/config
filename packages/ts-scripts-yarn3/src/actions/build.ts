import { runSteps } from '../lib'

export const build = () => {
  runSteps('Build', [
    ['yarn', 'compile'],
    ['yarn', 'lint'],
  ])
}
