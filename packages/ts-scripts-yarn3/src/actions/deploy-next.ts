import { runSteps } from '../lib'

export const deployNext = () => {
  runSteps('Deploy [Next]', [
    ['yarn', 'clean'],
    ['yarn', 'workspaces foreach --all version minor --deferred'],
    ['yarn', 'build'],
    ['yarn', 'cycle'],
    ['yarn', 'gen-docs'],
    ['yarn', 'version apply --all --prerelease'],
    ['yarn', 'workspaces foreach -pt npm publish --tag next'],
  ])
}
