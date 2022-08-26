import { runSteps } from '../lib'

export const compileEsm = () => {
  const proj = process.env.PROJECT_CWD
  runSteps('Compile [ESM]', [
    ['yarn', ['tsconfig-gen:esm']],
    ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/.bin/package-compile-esm`],
  ])
}
