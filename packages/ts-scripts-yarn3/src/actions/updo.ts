import { runSteps } from '../lib'

export const updo = () => {
  runSteps('Updo', [
    ['yarn', 'install'],
    ['yarn', 'upgrade-interactive'],
    ['yarn', 'dedupe'],
  ])
}
