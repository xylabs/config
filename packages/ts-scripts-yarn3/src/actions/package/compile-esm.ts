import { existsSync } from 'fs'

import { runSteps, ScriptStep } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD
  const proj = process.env.PROJECT_CWD
  const steps: ScriptStep[] = [['tsc', ['-p', `${pkg}/.tsconfig.build.esm.json`]]]
  const dist = `${pkg}/dist/esm`
  if (existsSync(dist)) {
    steps.unshift([`${proj}/node_modules/rimraf/bin.js`, ['-q', `${dist}`]])
  }
  runSteps('Package Compile [ESM]', steps)
}
