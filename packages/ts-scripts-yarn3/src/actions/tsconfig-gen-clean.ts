import { runSteps } from '../lib'

export const tsconfigGenClean = () => {
  return runSteps('Clean Configs', [['node', ['./node_modules/rimraf/bin.js', '-q', '**/.tsconfig*']]])
}
