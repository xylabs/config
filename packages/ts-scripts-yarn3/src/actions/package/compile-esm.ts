import { runSteps } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD

  return runSteps('Package Compile [ESM]', [['tsc', ['--build', '-p', `${pkg}/.tsconfig.build.esm.json`]]])
}
