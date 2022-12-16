import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const compile = ({ target }: CompileParams) => {
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'cjs']],
          ['yarn', 'workspaces foreach -ptA run package-compile-cjs'],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'esm']],
          ['yarn', 'workspaces foreach -ptA run package-compile-esm'],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm']],
        ]
      : []

  return runSteps('Compile', [...esmSteps]) || runSteps('Compile', [...cjsSteps]) || runSteps('Compile', [['yarn', 'deps']])
}
