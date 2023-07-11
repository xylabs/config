import { runSteps } from '../lib'

export const deployMajor = () => {
  return runSteps('Deploy [Major]', [
    ['yarn', 'workspaces foreach --all version major --deferred'],
    ['yarn', 'xy rebuild'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
