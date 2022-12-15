import { runSteps } from '../lib'

export const deployMajor = () => {
  return runSteps('Deploy [Major]', [
    ['yarn', 'clean'],
    ['yarn', 'workspaces foreach --all version major --deferred'],
    ['yarn', 'build'],
    ['yarn', 'cycle'],
    ['yarn', 'gen-docs'],
    ['yarn', 'version apply --all'],
    ['yarn', 'workspaces foreach -pt npm publish'],
  ])
}
