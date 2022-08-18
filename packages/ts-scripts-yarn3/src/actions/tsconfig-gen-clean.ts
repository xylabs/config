import { runSteps } from '../lib'

export const tsconfigGenClean = () => {
  runSteps('Clean Configs', [['./node_modules/rimraf/bin.js', ['-q', '**/.tsconfig*']]])
}
