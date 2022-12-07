import { runSteps } from '../../lib'

export const packageCompileCjs = () => {
  const pkg = process.env.INIT_CWD

  return runSteps('Package Compile [CJS]', [['tsc', ['--build', '-p', `${pkg}/.tsconfig.build.cjs.json`]]])
}
