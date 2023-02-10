import { runSteps, runStepsAsync } from '@xylabs/ts-scripts-yarn3'

export const packageCompile = () => {
  return runSteps('Package Compile', [['yarn', ['react-scripts', 'build']]])
}

export const packageCompileAsync = () => {
  return runStepsAsync('Package Compile', [['yarn', ['react-scripts', 'build']]])
}
