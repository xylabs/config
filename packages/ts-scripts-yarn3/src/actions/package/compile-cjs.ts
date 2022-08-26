import { runSteps, ScriptStep } from '../../lib'

export const packageCompileCjs = () => {
  const pkg = process.env.INIT_CWD
  const steps: ScriptStep[] = [['tsc', ['-p', `${pkg}/.tsconfig.build.cjs.json`]]]
  runSteps('Package Compile [CJS]', steps)
}
