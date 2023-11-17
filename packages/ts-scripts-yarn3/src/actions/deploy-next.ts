import { runSteps } from '../lib'

export const deployNext = () => {
  return runSteps('Deploy [Next]', [
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'xy clean'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'version apply --all --prerelease'],
    ['yarn', 'workspaces foreach --all npm publish --tag next'],
  ])
}
