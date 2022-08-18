import { runSteps } from '../lib'

export const compileCjs = () => {
  runSteps('Compile [CJS]', [
    ['yarn', ['tsconfig-gen:cjs']],
    ['yarn', 'workspaces foreach -ptA exec tsc -p ./.tsconfig.build.cjs.json'],
  ])
}
