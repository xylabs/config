import { runSteps } from '../lib/index.ts'

export const updo = () => {
  return runSteps('Updo', [
    ['yarn', 'install'],
    ['yarn', 'upgrade-interactive'],
    ['yarn', 'dedupe'],
  ])
}
