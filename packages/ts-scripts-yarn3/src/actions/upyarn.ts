import { runSteps } from '../lib'

export const updateYarnVersion = () => {
  return runSteps('Update Yarn Version', [['yarn', ['set', 'version', 'latest']]])
}
