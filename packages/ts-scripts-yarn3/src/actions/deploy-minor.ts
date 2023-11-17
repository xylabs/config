import { runSteps } from '../lib'

export const deployMinor = () => {
  return runSteps('Deploy [Minor]', [
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'xy clean'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach --all npm publish'],
  ])
}
