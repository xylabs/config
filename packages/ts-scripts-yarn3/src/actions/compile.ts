import { runSteps, runStepsAsync, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const compile = async ({ target }: CompileParams) => {
  const proj = process.env.PROJECT_CWD
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'cjs']],
          ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-cjs.js`],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'esm']],
          ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-esm.js`],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm']],
        ]
      : []

  return (
    (await Promise.all([runStepsAsync('Compile', [...esmSteps]), runStepsAsync('Compile', [...cjsSteps])])).find((value) => value > 0) ||
    runSteps('Compile', [['yarn', 'deps']])
  )
}
