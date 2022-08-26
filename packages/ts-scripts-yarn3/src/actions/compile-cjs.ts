import { runSteps } from '../lib'

export const compileCjs = () => {
  const proj = process.env.PROJECT_CWD
  runSteps('Compile [CJS]', [
    ['yarn', ['tsconfig-gen:cjs']],
    ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/.bin/package-compile-cjs`],
  ])
}
