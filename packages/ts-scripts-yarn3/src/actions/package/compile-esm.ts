import { runSteps } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD

  return runSteps('Package Compile [ESM]', [
    ['yarn', ['package-tsconfig-gen-esm']],
    ['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`]],
    ['yarn', ['package-copy-assets-esm']],
  ])
}
