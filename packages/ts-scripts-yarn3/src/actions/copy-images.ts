import { runSteps } from '../lib'

export const copyImages = () => {
  runSteps('Copy Images', [
    ['yarn', 'copy-images:esm'],
    ['yarn', 'copy-images:cjs'],
  ])
}
