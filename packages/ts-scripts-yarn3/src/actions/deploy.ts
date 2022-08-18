import { runSteps } from '../lib'

export const deploy = () => {
  runSteps('Deploy [Patch]', [
    ['yarn', 'clean'],
    ['yarn', 'workspaces foreach --all version patch --deferred'],
    ['yarn', 'build'],
    ['yarn', 'cycle'],
    ['yarn', 'gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
