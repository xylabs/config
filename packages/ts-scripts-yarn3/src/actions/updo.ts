import { runSteps } from '../lib'

export const updo = () => {
  return runSteps('Updo', [
    ['yarn', 'install'],
    ['yarn', 'upgrade-interactive'],
    ['yarn', 'dedupe'],
  ])
}
