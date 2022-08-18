import { runSteps } from '../lib'

export const rebuild = () => {
  runSteps('Rebuild', [
    ['yarn', 'clean'],
    ['yarn', 'build'],
  ])
}
