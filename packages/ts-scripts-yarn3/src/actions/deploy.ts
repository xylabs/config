import { runSteps } from '../lib'

export const deploy = () => {
  return runSteps('Deploy [Patch]', [
    ['yarn', 'xy clean'],
    ['yarn', 'workspaces foreach --all version patch --deferred'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'xy gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
