import { existsSync } from 'fs'

import { runSteps, ScriptStep } from '../../lib'

export const packageCompileCjs = () => {
  const pkg = process.env.INIT_CWD
  const proj = process.env.PROJECT_CWD
  const steps: ScriptStep[] = [['tsc', ['-p', `${pkg}/.tsconfig.build.cjs.json`]]]
  const dist = `${pkg}/dist/cjs`
  if (existsSync(dist)) {
    steps.unshift([`${proj}/node_modules/rimraf/bin.js`, ['-q', `${dist}`]])
  }
  runSteps('Package Compile [CJS]', steps)
}
