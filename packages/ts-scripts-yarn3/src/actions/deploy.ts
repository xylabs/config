import { runSteps } from '../lib'

export const deploy = () => {
  return runSteps('Deploy [Patch]', [
    ['yarn', 'workspaces foreach --all version patch --deferred'],
    ['yarn', 'xy rebuild'],
    ['yarn', 'xy cycle'],
    ['yarn', 'xy gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
