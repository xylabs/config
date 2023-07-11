import { runSteps } from '../lib'

export const deployNext = () => {
  return runSteps('Deploy [Next]', [
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'xy rebuild'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all --prerelease'],
    ['yarn', 'workspaces foreach -pt npm publish --tag next'],
  ])
}
