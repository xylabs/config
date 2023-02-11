import { runSteps } from '../../lib'

export const packageCompileCjs = () => {
  const pkg = process.env.INIT_CWD

  return runSteps('Package Compile [CJS]', [
    ['yarn', ['package-tsconfig-gen-cjs']],
    ['tsc', ['--build', `${pkg}/.tsconfig.build.cjs.json`]],
    ['yarn', ['package-copy-assets-cjs']],
  ])
}
