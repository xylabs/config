import { runSteps } from '../lib/index.ts'

export const updateYarnVersion = () => {
  return runSteps('Update Yarn Version', [['yarn', ['set', 'version', 'latest']]])
}
