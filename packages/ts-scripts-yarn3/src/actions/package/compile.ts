import { runSteps, runStepsAsync } from '../../lib'

export const packageCompile = () => {
  return runSteps('Package Compile', [
    ['yarn', ['package-compile-cjs']],
    ['yarn', ['package-compile-esm']],
  ])
}

export const packageCompileAsync = () => {
  return runStepsAsync('Package Compile', [
    ['yarn', ['package-compile-cjs']],
    ['yarn', ['package-compile-esm']],
  ])
}
