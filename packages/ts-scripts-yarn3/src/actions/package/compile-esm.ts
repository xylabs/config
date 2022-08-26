import { runSteps, ScriptStep } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD
  const steps: ScriptStep[] = [['tsc', ['-p', `${pkg}/.tsconfig.build.esm.json`]]]
  runSteps('Package Compile [ESM]', steps)
}
