import { runSteps } from '../lib'

export const tsconfigGen = () => {
  runSteps('Generate Configs', [
    ['yarn', 'tsconfig-gen:esm'],
    ['yarn', 'tsconfig-gen:cjs'],
    ['yarn', 'tsconfig-gen:test'],
  ])
}
