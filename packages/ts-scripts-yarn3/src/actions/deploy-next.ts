import { runSteps } from '../lib'

export const deployNext = () => {
  return runSteps('Deploy [Next]', [
    ['yarn', 'xy clean'],
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'xy build'],
    ['yarn', 'xy cycle'],
    ['yarn', 'xy gen-docs'],
    ['yarn', 'version apply --all --prerelease'],
    ['yarn', 'workspaces foreach -pt npm publish --tag next'],
  ])
}
