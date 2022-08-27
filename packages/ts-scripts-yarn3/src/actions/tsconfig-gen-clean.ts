import { runSteps } from '../lib'

export const tsconfigGenClean = () => {
  runSteps('Clean Configs', [['node', ['./node_modules/rimraf/bin.js', '-q', '**/.tsconfig*']]])
}
