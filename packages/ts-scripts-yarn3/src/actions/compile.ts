import { runSteps } from '../lib'

export const compile = () => {
  runSteps('Compile', [
    ['yarn', 'clean'],
    ['yarn', 'compile:esm'],
    ['yarn', 'compile:cjs'],
    ['yarn', 'copy-images:esm'],
    ['yarn', 'copy-images:cjs'],
    ['yarn', 'deps'],
  ])
}
