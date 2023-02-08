import { runSteps, runStepsAsync } from '../../lib'

export const packageCompile = () => {
  const pkg = process.env.INIT_CWD

  return runSteps('Package Compile', [
    ['tsc', ['--build', `${pkg}/.tsconfig.build.cjs.json`]],
    ['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`]],
  ])
}

export const packageCompileAsync = () => {
  const pkg = process.env.INIT_CWD

  return runStepsAsync('Package Compile', [
    ['tsc', ['--build', `${pkg}/.tsconfig.build.cjs.json`]],
    ['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`]],
  ])
}
