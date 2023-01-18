import { runSteps } from '../lib'

export const deployMajor = () => {
  return runSteps('Deploy [Major]', [
    ['yarn', 'xy clean'],
    ['yarn', 'workspaces foreach --all version major --deferred'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'xy gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
