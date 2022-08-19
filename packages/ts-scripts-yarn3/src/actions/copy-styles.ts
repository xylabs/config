import { runSteps } from '../lib'

export const copyStyles = () => {
  runSteps('Copy Styles', [
    ['yarn', 'copy-styles:esm'],
    ['yarn', 'copy-styles:cjs'],
  ])
}
