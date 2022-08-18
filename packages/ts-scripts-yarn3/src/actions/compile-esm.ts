import { runSteps } from '../lib'

export const compileEsm = () => {
  runSteps('Compile [ESM]', [
    ['yarn', ['tsconfig-gen:esm']],
    ['yarn', 'workspaces foreach -ptA exec tsc -p ./.tsconfig.build.esm.json'],
  ])
}
