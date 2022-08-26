import { existsSync } from 'fs'

import { runSteps, ScriptStep } from '../../lib'

export const packageClean = () => {
  const pkg = process.env.INIT_CWD
  const proj = process.env.PROJECT_CWD
  const pkgName = process.env.npm_package_name
  const dist = `${pkg}/dist`
  const steps: ScriptStep[] = existsSync(dist) ? [[`${proj}/node_modules/rimraf/bin.js`, ['-q', `${dist}`]]] : []
  runSteps(`Package Clean [${pkgName}]`, steps)
}
