import { runSteps } from '../lib'

export const deployMajor = () => {
  return runSteps('Deploy [Major]', [
    ['yarn', 'workspaces foreach --all version major --deferred'],
    ['yarn', 'xy clean'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach --all npm publish'],
  ])
}
