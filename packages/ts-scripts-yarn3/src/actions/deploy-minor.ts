import { runSteps } from '../lib'

export const deployMinor = () => {
  return runSteps('Deploy [Minor]', [
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'xy rebuild'],
    ['yarn', 'xy cycle'],
    ['yarn', 'xy gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
