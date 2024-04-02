import { runSteps } from '../lib'

export const deploy = () => {
  return runSteps('Deploy [Patch]', [
    ['yarn', 'workspaces foreach --all version patch --deferred'],
    ['yarn', 'xy clean'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach --all --parallel npm publish'],
  ])
}
